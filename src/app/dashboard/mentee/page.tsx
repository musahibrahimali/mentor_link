
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MessageSquare, Lightbulb, UserCheck, Search, Star, Edit2 } from 'lucide-react';
import type { Mentor, MentorshipAssignment, SessionLog, User } from '@/types';
import { MentorCard } from '@/components/features/mentorship/MentorCard';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';


export default function MenteeDashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [currentMentor, setCurrentMentor] = useState<User | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionLog[]>([]);
  const [pastSessions, setPastSessions] = useState<SessionLog[]>([]);
  const [suggestedMentors, setSuggestedMentors] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<SessionLog | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);


  const fetchMenteeData = useCallback(async (menteeId: string) => {
    setIsLoadingData(true);
    try {
      // Find current mentor assignment
      const assignmentQuery = query(collection(db, "mentorships"), where("menteeId", "==", menteeId), where("status", "==", "active"));
      const assignmentSnapshot = await getDocs(assignmentQuery);

      let mentorData: User | null = null;
      if (!assignmentSnapshot.empty) {
        const assignment = assignmentSnapshot.docs[0].data() as MentorshipAssignment;
        const mentorDoc = await getDoc(doc(db, "users", assignment.mentorId));
        if (mentorDoc.exists()) {
          mentorData = { id: mentorDoc.id, ...mentorDoc.data() } as User;
        }
      }
      setCurrentMentor(mentorData);

      // Fetch sessions with this mentor (or all sessions if no specific mentor yet)
      const sessionsQuery = mentorData 
        ? query(collection(db, "sessions"), where("menteeId", "==", menteeId), where("mentorId", "==", mentorData.id))
        : query(collection(db, "sessions"), where("menteeId", "==", menteeId));
      
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const allUserSessions = sessionsSnapshot.docs.map(sDoc => ({id: sDoc.id, ...sDoc.data()} as SessionLog))
                                .sort((a,b) => b.sessionDate.toMillis() - a.sessionDate.toMillis());

      const now = new Date();
      setUpcomingSessions(allUserSessions.filter(s => s.status === 'scheduled' && s.sessionDate.toDate() >= now));
      setPastSessions(allUserSessions.filter(s => s.status === 'completed' || (s.status === 'scheduled' && s.sessionDate.toDate() < now)));
      
      // Fetch suggested mentors (simplified: fetch a few mentors not the current one)
      const mentorsQuery = query(collection(db, "users"), where("role", "==", "mentor"), where("isActive", "==", true));
      const mentorsSnapshot = await getDocs(mentorsQuery);
      const allMentors = mentorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setSuggestedMentors(allMentors.filter(m => m.id !== mentorData?.id).slice(0, 3)); // Limit suggestions

    } catch (error) {
      console.error("Error fetching mentee data:", error);
      toast({ title: "Error", description: "Could not load your dashboard data.", variant: "destructive" });
    }
    setIsLoadingData(false);
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== 'mentee') {
        router.push('/login');
      } else {
        fetchMenteeData(authUser.id);
      }
    }
  }, [authUser, authLoading, router, fetchMenteeData]);

  const handleOpenFeedbackDialog = (session: SessionLog) => {
    setSelectedSessionForFeedback(session);
    // Check if feedback already exists for this session by this user (mentee)
    // For now, we assume one feedback per session by mentee.
    // A more robust system would store feedback in a separate collection.
    // This is a simplified placeholder.
    setFeedbackText(session.notes || ''); // Pre-fill if notes exist, or fetch existing feedback
    setFeedbackRating(0); // Reset rating
    setIsFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSessionForFeedback || !authUser) return;
    if (feedbackRating === 0 && !feedbackText) {
        toast({ title: "Feedback Incomplete", description: "Please provide a rating or some text feedback.", variant: "destructive"});
        return;
    }
    // This is a placeholder for submitting feedback.
    // In a real app, this would update the session document or create a new feedback document.
    // For simplicity, we'll just log it and show a toast.
    console.log("Feedback submitted for session:", selectedSessionForFeedback.id, "Rating:", feedbackRating, "Text:", feedbackText);
    // Example: Update session with menteeFeedback
    // await updateDoc(doc(db, "sessions", selectedSessionForFeedback.id), {
    //   menteeFeedbackText: feedbackText,
    //   menteeFeedbackRating: feedbackRating,
    //   menteeFeedbackAt: serverTimestamp()
    // });
    toast({ title: "Feedback Submitted", description: "Thank you for your feedback!" });
    setIsFeedbackDialogOpen(false);
    setSelectedSessionForFeedback(null);
    setFeedbackText('');
    setFeedbackRating(0);
    // Optionally refetch data if feedback changes session display
    // fetchMenteeData(authUser.id); 
  };


  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!authUser || authUser.role !== 'mentee') {
    return <div className="container mx-auto py-12 px-4 text-center">Access Denied. Mentees only.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary">Mentee Dashboard</h1>
      
      {currentMentor ? (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><UserCheck className="mr-2 h-5 w-5 text-accent" /> Your Mentor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={currentMentor.profilePictureUrl || `https://placehold.co/150x150?text=${currentMentor.name.substring(0,2).toUpperCase()}`} alt={currentMentor.name} data-ai-hint="professional portrait"/>
              <AvatarFallback>{currentMentor.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-2xl font-semibold">{currentMentor.name}</h3>
              <p className="text-muted-foreground line-clamp-2">{currentMentor.bio || "Bio not available."}</p>
              <p className="text-sm text-muted-foreground mt-1">Availability: {currentMentor.availability || "Not specified"}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
              <Button asChild><Link href={`/mentors/${currentMentor.id}`}><MessageSquare className="mr-2 h-4 w-4" /> Message (Placeholder)</Link></Button>
              <Button variant="outline" asChild><Link href={`/mentors/${currentMentor.id}`}><CalendarDays className="mr-2 h-4 w-4" /> View Profile</Link></Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl">
            <CardHeader><CardTitle className="font-headline text-xl text-primary">Find Your Mentor</CardTitle></CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">You are not currently matched with a mentor. Explore available mentors to start your journey!</p>
                <Button asChild><Link href="/mentors"><Search className="mr-2 h-4 w-4"/> Find a Mentor</Link></Button>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-accent" /> Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <ul className="space-y-3">
                {upcomingSessions.map(session => (
                  <li key={session.id} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{session.topic}</p>
                      <p className="text-sm text-muted-foreground">With {session.mentorName} on {session.sessionDate.toDate().toLocaleDateString()} at {session.sessionDate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {/* View details could link to a session page or open a dialog */}
                    <Button variant="outline" size="sm" disabled>View Details</Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming sessions scheduled. Reach out to your mentor or find one to plan your next meeting!</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><Edit2 className="mr-2 h-5 w-5 text-accent" /> Past Sessions & Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {pastSessions.length > 0 ? (
              <ul className="space-y-3">
                {pastSessions.map(session => (
                  <li key={session.id} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{session.topic} {session.status === 'completed' ? '' : `(${session.status})`}</p>
                      <p className="text-sm text-muted-foreground">With {session.mentorName} on {session.sessionDate.toDate().toLocaleDateString()}</p>
                    </div>
                    {session.status === 'completed' && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenFeedbackDialog(session)}>Give Feedback</Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No past sessions recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent" />Recommended Mentors</CardTitle>
          <CardDescription>Based on your profile, here are some mentors you might like:</CardDescription>
        </CardHeader>
        <CardContent>
          {suggestedMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor as Mentor} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No mentor suggestions available. Complete your profile for better matches or browse all mentors.</p>
          )}
           <Button variant="link" asChild className="mt-4"><Link href="/mentors">Browse All Mentors <Search className="ml-2 h-4 w-4"/></Link></Button>
        </CardContent>
      </Card>

       {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback for session: {selectedSessionForFeedback?.topic}</DialogTitle>
            <DialogDescription>
              Share your thoughts on the session with {selectedSessionForFeedback?.mentorName} on {selectedSessionForFeedback ? format(selectedSessionForFeedback.sessionDate.toDate(), "PPP") : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    onClick={() => setFeedbackRating(star)}
                    className={feedbackRating >= star ? 'text-yellow-400' : 'text-muted-foreground'}
                  >
                    <Star className={feedbackRating >= star ? 'fill-current' : ''} />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="feedback-text">Your Feedback</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What went well? What could be improved?"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
