
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarPlus, MessageSquare, Users, CheckCircle, Clock } from 'lucide-react';
import type { Mentee } from '@/types'; // Assuming Mentee extends User with relevant fields
import Link from 'next/link';

// Mock Data
const mockMenteesData: (Mentee & { lastActivity?: string; upcomingSession?: string })[] = [
  { 
    id: "mentee001", 
    name: "Alex Johnson", 
    email: "alex.j@example.com", 
    role: "mentee", 
    profilePictureUrl: "https://placehold.co/100x100/669999/F0F5F5.png?text=AJ", 
    bio: "Eager to learn full-stack development.",
    skills: ["JavaScript", "HTML"],
    interests: ["Web Dev"],
    lastActivity: "Viewed profile 2 hours ago",
    upcomingSession: "Tomorrow at 3 PM"
  },
  { 
    id: "mentee002", 
    name: "Sarah Lee", 
    email: "sarah.l@example.com", 
    role: "mentee", 
    profilePictureUrl: "https://placehold.co/100x100/FFC0CB/000000.png?text=SL",
    bio: "Interested in UX design principles.",
    skills: ["Figma", "User Research"],
    interests: ["Mobile UX"],
    lastActivity: "Sent message yesterday",
    upcomingSession: "Next week, Mon 10 AM"
  },
];

const mockRequestsData: (Mentee & { requestMessage?: string })[] = [
    {
        id: "mentee003",
        name: "Chris Green",
        email: "chris.g@example.com",
        role: "mentee",
        profilePictureUrl: "https://placehold.co/100x100/A0D2DB/000000.png?text=CG",
        bio: "Looking for guidance on Python and data science.",
        skills: ["Python", "Pandas"],
        interests: ["Machine Learning"],
        requestMessage: "Hi Dr. Vance, I'm very interested in your work in AI and would love to learn from you."
    }
]


export default function MentorDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [myMentees, setMyMentees] = useState(mockMenteesData);
  const [menteeRequests, setMenteeRequests] = useState(mockRequestsData);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'mentor')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'mentor') {
    return <div className="container mx-auto py-12 px-4 text-center">Loading mentor dashboard...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary">Mentor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Mentees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{myMentees.length}</div>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{menteeRequests.length}</div>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div> {/* Mocked */}
                <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
        </Card>
      </div>

      {/* Mentee Requests Section */}
      {menteeRequests.length > 0 && (
        <Card className="shadow-xl">
            <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Mentee Requests</CardTitle>
            <CardDescription>Review and respond to new requests from potential mentees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {menteeRequests.map(request => (
                <Card key={request.id} className="bg-secondary/30">
                    <CardHeader className="flex flex-row items-start gap-4 p-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={request.profilePictureUrl} alt={request.name} data-ai-hint="avatar person" />
                            <AvatarFallback>{request.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{request.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{request.skills?.slice(0,3).join(', ')}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-foreground mb-3 italic">&quot;{request.requestMessage}&quot;</p>
                        <div className="flex gap-2">
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="outline">Decline</Button>
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={`/mentors/mentee-profile/${request.id}`}>View Profile</Link> 
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            </CardContent>
        </Card>
      )}


      {/* My Mentees Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">My Mentees</CardTitle>
          <CardDescription>Manage your current mentees, schedule meetings, and send messages.</CardDescription>
        </CardHeader>
        <CardContent>
          {myMentees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myMentees.map((mentee) => (
                <Card key={mentee.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 p-4 bg-muted/20">
                    <Avatar className="h-16 w-16 border-2 border-primary">
                      <AvatarImage src={mentee.profilePictureUrl} alt={mentee.name} data-ai-hint="avatar person" />
                      <AvatarFallback>{mentee.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{mentee.name}</CardTitle>
                      <CardDescription className="text-xs">{mentee.email}</CardDescription>
                      {mentee.upcomingSession && <p className="text-xs text-accent mt-1">Next: {mentee.upcomingSession}</p>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 text-sm">
                    <p className="line-clamp-2 mb-2">{mentee.bio}</p>
                    <p className="text-xs text-muted-foreground">Skills: {mentee.skills?.join(', ')}</p>
                    <p className="text-xs text-muted-foreground">Interests: {mentee.interests?.join(', ')}</p>
                  </CardContent>
                  <CardFooter className="p-4 border-t flex gap-2">
                    <Button size="sm" variant="outline"><CalendarPlus className="mr-2 h-4 w-4" /> Schedule</Button>
                    <Button size="sm" variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Message</Button>
                     <Button size="sm" variant="ghost" asChild>
                        <Link href={`/mentors/mentee-profile/${mentee.id}`}>View Profile</Link> 
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You currently have no assigned mentees.</p>
          )}
        </CardContent>
      </Card>
      
      {/* Tools Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Tools & Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="default"><CalendarPlus className="mr-2 h-4 w-4" /> Set General Availability</Button>
          <p className="text-sm text-muted-foreground">More tools for mentors will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
