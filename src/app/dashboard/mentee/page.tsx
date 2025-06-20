
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MessageSquare, Lightbulb, UserCheck, Search } from 'lucide-react';
import type { Mentor } from '@/types';
import { MentorCard } from '@/components/features/mentorship/MentorCard'; // For AI suggested mentors
import Link from 'next/link';

// Mock Data
const mockCurrentMentorData: Mentor | null = {
  id: "mentor001",
  name: "Dr. Eleanor Vance",
  email: "eleanor@example.com",
  role: "mentor",
  profilePictureUrl: "https://placehold.co/150x150/996699/FAF5FA.png?text=EV",
  bio: "Passionate AI researcher with 10+ years in Machine Learning and Natural Language Processing.",
  skills: ["Machine Learning", "Python", "NLP", "Deep Learning", "Research"],
  interests: ["AI Ethics", "Reinforcement Learning"],
  availability: "Weekends, Tuesday evenings",
};

const mockUpcomingSessionsData = [
    { id: "sess001", mentorName: "Dr. Eleanor Vance", dateTime: new Date(Date.now() + 1000*60*60*24*2).toISOString(), topic: "Discuss Project Outline" },
    { id: "sess002", mentorName: "Dr. Eleanor Vance", dateTime: new Date(Date.now() + 1000*60*60*24*7).toISOString(), topic: "Resume Review" },
];

// Mock data for AI suggested mentors (if user is a mentee)
const mockSuggestedMentors: Mentor[] = [
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus@example.com",
    role: "mentor",
    bio: "Full-stack developer and startup founder. I can help with web technologies (React, Node.js), product development, and entrepreneurial mindset.",
    skills: ["React", "Node.js", "TypeScript", "Product Management"],
    interests: ["SaaS", "FinTech"],
    availability: "Monday & Wednesday evenings",
    profilePictureUrl: "https://placehold.co/300x300/996699/FAF5FA.png?text=MC",
  },
  {
    id: "3",
    name: "Aisha Khan",
    email: "aisha@example.com",
    role: "mentor",
    bio: "UX Design Lead with a focus on user-centered design and accessibility. I love helping new designers build their portfolios and navigate the industry.",
    skills: ["UX Design", "UI Design", "Figma", "User Research"],
    interests: ["Design Systems", "Inclusive Design"],
    availability: "Flexible, by appointment",
    profilePictureUrl: "https://placehold.co/300x300/669999/F0F5F5.png?text=AK",
  },
];


export default function MenteeDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(mockCurrentMentorData);
  const [upcomingSessions, setUpcomingSessions] = useState(mockUpcomingSessionsData);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'mentee')) {
      // Allow admin to view for testing, but ideally redirect non-mentees
      if (user && user.role === 'admin') {
        // Admin can view, but maybe show a banner
      } else if (!user || user.role !== 'mentee') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) { // Check !user specifically if not allowing admin through
    return <div className="container mx-auto py-12 px-4 text-center">Loading mentee dashboard...</div>;
  }
  // Add this check if admin should also be redirected:
  // if (user.role !== 'mentee') {
  //   return <div className="container mx-auto py-12 px-4 text-center">Access Denied. This is a mentee dashboard.</div>;
  // }


  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary">Mentee Dashboard</h1>
      
      {/* Current Mentor Section */}
      {currentMentor ? (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center"><UserCheck className="mr-2 h-5 w-5 text-accent" /> Your Mentor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={currentMentor.profilePictureUrl} alt={currentMentor.name} data-ai-hint="professional portrait"/>
              <AvatarFallback>{currentMentor.name.substring(0,2)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-2xl font-semibold">{currentMentor.name}</h3>
              <p className="text-muted-foreground line-clamp-2">{currentMentor.bio}</p>
              <p className="text-sm text-muted-foreground mt-1">Availability: {currentMentor.availability}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
              <Button asChild><Link href={`/mentors/${currentMentor.id}`}><MessageSquare className="mr-2 h-4 w-4" /> Message Mentor</Link></Button>
              <Button variant="outline" asChild><Link href={`/mentors/${currentMentor.id}`}><CalendarDays className="mr-2 h-4 w-4" /> View Profile</Link></Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Find Your Mentor</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">You are not currently matched with a mentor. Explore available mentors to start your journey!</p>
                <Button asChild><Link href="/mentors"><Search className="mr-2 h-4 w-4"/> Find a Mentor</Link></Button>
            </CardContent>
        </Card>
      )}

      {/* Upcoming Sessions Section */}
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
                    <p className="text-sm text-muted-foreground">With {session.mentorName} on {new Date(session.dateTime).toLocaleDateString()} at {new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No upcoming sessions scheduled. Reach out to your mentor to plan your next meeting!</p>
          )}
        </CardContent>
      </Card>
      
      {/* Recommended Mentors Section */}
      <Card className="shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent" />Recommended Mentors</CardTitle>
          <CardDescription>Based on your profile, here are some mentors you might like:</CardDescription>
        </CardHeader>
        <CardContent>
          {mockSuggestedMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSuggestedMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No mentor suggestions available at the moment. Complete your profile for better matches!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

