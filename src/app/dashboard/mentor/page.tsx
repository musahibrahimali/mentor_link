
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarPlus, MessageSquare, Users, CheckCircle, Clock, Edit3, BookOpen } from 'lucide-react';
import type { Mentee, MentorshipAssignment, SessionLog, User } from '@/types';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function MentorDashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [myMentees, setMyMentees] = useState<User[]>([]);
  const [menteeDetails, setMenteeDetails] = useState<Record<string, { assignments: MentorshipAssignment[], sessions: SessionLog[] }>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [currentTargetMenteeId, setCurrentTargetMenteeId] = useState<string | null>(null);
  const [sessionTopic, setSessionTopic] = useState('');
  const [sessionDate, setSessionDate] = useState<Date | undefined>(undefined);
  const [sessionNotes, setSessionNotes] = useState('');
  
  const fetchMentorData = useCallback(async (mentorId: string) => {
    setIsLoadingData(true);
    try {
      // Fetch active assignments for this mentor
      const assignmentsQuery = query(collection(db, "mentorships"), where("mentorId", "==", mentorId), where("status", "==", "active"));
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      const currentAssignments = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MentorshipAssignment));
      
      const menteeIds = currentAssignments.map(a => a.menteeId);
      const fetchedMentees: User[] = [];
      const newMenteeDetails: Record<string, { assignments: MentorshipAssignment[], sessions: SessionLog[] }> = {};

      if (menteeIds.length > 0) {
        // Fetch mentee user details
        const menteesQuery = query(collection(db, "users"), where("id", "in", menteeIds));
        const menteesSnapshot = await getDocs(menteesQuery);
        menteesSnapshot.forEach(doc => {
            const menteeData = { id: doc.id, ...doc.data() } as User;
            if (menteeData.isActive !== false) { // Only show active mentees
                 fetchedMentees.push(menteeData);
            }
        });

        // For each mentee, fetch their sessions with this mentor
        for (const mentee of fetchedMentees) {
          const menteeAssignments = currentAssignments.filter(a => a.menteeId === mentee.id);
          const sessionsQuery = query(collection(db, "sessions"), where("mentorId", "==", mentorId), where("menteeId", "==", mentee.id));
          const sessionsSnapshot = await getDocs(sessionsQuery);
          const menteeSessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionLog))
            .sort((a,b) => b.sessionDate.toMillis() - a.sessionDate.toMillis()); // Sort recent first
          newMenteeDetails[mentee.id] = { assignments: menteeAssignments, sessions: menteeSessions };
        }
      }
      
      setMyMentees(fetchedMentees);
      setMenteeDetails(newMenteeDetails);

    } catch (error) {
      console.error("Error fetching mentor data:", error);
      toast({ title: "Error", description: "Could not load your dashboard data.", variant: "destructive" });
    }
    setIsLoadingData(false);
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== 'mentor') {
        router.push('/login');
      } else {
        fetchMentorData(authUser.id);
      }
    }
  }, [authUser, authLoading, router, fetchMentorData]);

  const handleScheduleSession = async () => {
    if (!sessionTopic || !sessionDate || !currentTargetMenteeId || !authUser) {
      toast({ title: "Error", description: "Please fill in all session details.", variant: "destructive" });
      return;
    }
    try {
      const newSessionRef = await addDoc(collection(db, 'sessions'), {
        mentorId: authUser.id,
        mentorName: authUser.name,
        menteeId: currentTargetMenteeId,
        menteeName: myMentees.find(m => m.id === currentTargetMenteeId)?.name || 'N/A',
        topic: sessionTopic,
        sessionDate: Timestamp.fromDate(sessionDate),
        status: 'scheduled',
        createdAt: serverTimestamp()
      });
      toast({ title: "Session Scheduled", description: `Session about "${sessionTopic}" scheduled.`});
      
      // Refresh data for the specific mentee or refetch all
      fetchMentorData(authUser.id);

      setIsScheduleDialogOpen(false);
      setSessionTopic('');
      setSessionDate(undefined);
      setCurrentTargetMenteeId(null);
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast({ title: "Error", description: "Failed to schedule session.", variant: "destructive" });
    }
  };

  const handleAddNote = async () => {
     if (!sessionNotes || !currentTargetMenteeId || !authUser) {
      toast({ title: "Error", description: "Note content is missing.", variant: "destructive" });
      return;
    }
     // This is a general note, not tied to a specific session, for simplicity.
     // In a real app, notes might be part of a session or a general log.
     // For now, let's add it to a "notes" subcollection on the mentorship assignment or user.
     // Simpler: Add to a specific "session" marked as a note.
     try {
      const newNoteSessionRef = await addDoc(collection(db, 'sessions'), {
        mentorId: authUser.id,
        mentorName: authUser.name,
        menteeId: currentTargetMenteeId,
        menteeName: myMentees.find(m => m.id === currentTargetMenteeId)?.name || 'N/A',
        topic: "Mentor Note",
        notes: sessionNotes,
        sessionDate: Timestamp.now(), // Note taken now
        status: 'completed', // Or a new status 'note'
        createdAt: serverTimestamp()
      });
      toast({ title: "Note Added", description: "Your note has been saved."});
      fetchMentorData(authUser.id); // Refresh data
      setIsAddNoteDialogOpen(false);
      setSessionNotes('');
      setCurrentTargetMenteeId(null);
    } catch (error) {
      console.error("Error adding note:", error);
      toast({ title: "Error", description: "Failed to add note.", variant: "destructive" });
    }
  };
  
  const openScheduleDialog = (menteeId: string) => {
    setCurrentTargetMenteeId(menteeId);
    setIsScheduleDialogOpen(true);
  };

  const openAddNoteDialog = (menteeId: string) => {
    setCurrentTargetMenteeId(menteeId);
    setIsAddNoteDialogOpen(true);
  };


  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!authUser || authUser.role !== 'mentor') {
    return <div className="container mx-auto py-12 px-4 text-center">Access Denied. Mentors only.</div>;
  }
  
  const upcomingSessionsCount = Object.values(menteeDetails)
    .flatMap(details => details.sessions)
    .filter(session => session.status === 'scheduled' && session.sessionDate.toDate() > new Date())
    .length;
    
  const completedSessionsCount = Object.values(menteeDetails)
    .flatMap(details => details.sessions)
    .filter(session => session.status === 'completed')
    .length;


  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary">Mentor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{myMentees.length}</div></CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{upcomingSessionsCount}</div></CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{completedSessionsCount}</div></CardContent>
        </Card>
      </div>

      {/* My Mentees Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">My Mentees</CardTitle>
          <CardDescription>Manage your current mentees, schedule meetings, and add notes.</CardDescription>
        </CardHeader>
        <CardContent>
          {myMentees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myMentees.map((mentee) => {
                const sessions = menteeDetails[mentee.id]?.sessions || [];
                const upcomingSession = sessions.find(s => s.status === 'scheduled' && s.sessionDate.toDate() > new Date());
                return (
                <Card key={mentee.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src={mentee.profilePictureUrl || `https://placehold.co/100x100?text=${mentee.name.substring(0,2).toUpperCase()}`} alt={mentee.name} data-ai-hint="avatar person" />
                      <AvatarFallback>{mentee.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentee.name}</CardTitle>
                      <CardDescription className="text-xs">{mentee.email}</CardDescription>
                      {upcomingSession && <p className="text-xs text-accent mt-1">Next: {upcomingSession.topic} on {upcomingSession.sessionDate.toDate().toLocaleDateString()}</p>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 text-sm space-y-2">
                    <p className="line-clamp-2 italic text-muted-foreground">&quot;{mentee.bio || "No bio provided."}&quot;</p>
                    <div>
                        <h4 className="font-semibold text-xs uppercase">Skills:</h4>
                        <p className="text-xs text-foreground">{mentee.skills?.join(', ') || "Not specified"}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-xs uppercase">Interests:</h4>
                        <p className="text-xs text-foreground">{mentee.interests?.join(', ') || "Not specified"}</p>
                    </div>
                    {sessions.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-xs uppercase">Recent Activity:</h4>
                            {sessions.slice(0,1).map(s => ( // Show most recent session/note
                                <p key={s.id} className="text-xs text-foreground">
                                    {s.topic} ({s.status}) - {s.sessionDate.toDate().toLocaleDateString()}
                                </p>
                            ))}
                        </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 border-t flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openScheduleDialog(mentee.id)}><CalendarPlus className="mr-2 h-4 w-4" /> Schedule</Button>
                    <Button size="sm" variant="outline" onClick={() => openAddNoteDialog(mentee.id)}><Edit3 className="mr-2 h-4 w-4" /> Add Note</Button>
                    {/* <Button size="sm" variant="ghost" asChild>
                        <Link href={`/mentors/mentee-profile/${mentee.id}`}>View Profile</Link> 
                    </Button> */}
                     {/* Placeholder for messaging */}
                    <Button size="sm" variant="outline" disabled><MessageSquare className="mr-2 h-4 w-4" /> Message</Button>
                  </CardFooter>
                </Card>
              )})}
            </div>
          ) : (
            <p className="text-muted-foreground">You currently have no assigned mentees.</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Scheduling Session */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule New Session</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="session-topic">Topic</Label>
              <Input id="session-topic" value={sessionTopic} onChange={(e) => setSessionTopic(e.target.value)} placeholder="e.g., Project Review" />
            </div>
            <div>
                <Label htmlFor="session-date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button id="session-date" variant={"outline"} className="w-full justify-start text-left font-normal">
                           <CalendarPlus className="mr-2 h-4 w-4" />
                           {sessionDate ? format(sessionDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={sessionDate} onSelect={setSessionDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
             <div>
              <Label htmlFor="session-time">Time (Optional)</Label>
              <Input id="session-time" type="time" placeholder="e.g., 10:00 AM" />
              <p className="text-xs text-muted-foreground mt-1">Note: Time is for your reference. Full calendar integration is a future feature.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleSession}>Schedule Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for Adding Note */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Note for {myMentees.find(m=>m.id === currentTargetMenteeId)?.name || 'Mentee'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="session-notes">Notes</Label>
              <Textarea id="session-notes" value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} placeholder="Enter your private notes here..." className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card className="shadow-xl">
        <CardHeader><CardTitle className="font-headline text-xl text-primary">Tools & Resources</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="default" disabled><BookOpen className="mr-2 h-4 w-4" /> View Mentorship Guides (Placeholder)</Button>
          <p className="text-sm text-muted-foreground">More tools for mentors will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
