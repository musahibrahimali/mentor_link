
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mentor as MentorType } from "@/types"; // Renamed to avoid conflict
import { InterestForm } from "./InterestForm";
import { Briefcase, CalendarDays, CheckCheck, GraduationCap, Lightbulb, Mail, MapPin, MessageSquare, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";


export default function MentorProfilePage({ params }: { params: { id: string } }) {
  const [mentor, setMentor] = useState<MentorType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user: authUser } = useAuth(); // Get current authenticated user

  const fetchMentorProfile = useCallback(async (mentorId: string) => {
    setIsLoading(true);
    try {
      const mentorRef = doc(db, "users", mentorId);
      const docSnap = await getDoc(mentorRef);
      if (docSnap.exists() && docSnap.data().role === 'mentor' && docSnap.data().isActive !== false) {
        setMentor({ id: docSnap.id, ...docSnap.data() } as MentorType);
      } else {
        toast({ title: "Mentor Not Found", description: "This mentor profile is not available.", variant: "destructive" });
        setMentor(null); // Explicitly set to null if not found or not a mentor
      }
    } catch (error) {
      console.error("Error fetching mentor profile:", error);
      toast({ title: "Error", description: "Could not load mentor profile.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (params.id) {
      fetchMentorProfile(params.id);
    }
  }, [params.id, fetchMentorProfile]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8 sticky top-24">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-destructive">Mentor Not Found</h1>
        <p className="text-muted-foreground mt-2">The mentor profile you are looking for does not exist or is not active.</p>
        <Button asChild className="mt-6">
          <Link href="/mentors">Back to Mentors List</Link>
        </Button>
      </div>
    );
  }

  const canExpressInterest = authUser && authUser.id !== mentor.id; // User is logged in and not viewing their own profile

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8 sticky top-24">
           <Card className="shadow-xl overflow-hidden bg-card">
            <div className="relative h-64 w-full">
              <Image
                src={mentor.profilePictureUrl || `https://placehold.co/400x400.png?text=${mentor.name.substring(0,2).toUpperCase()}`}
                alt={mentor.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="professional headshot"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h1 className="text-3xl font-headline font-bold text-primary">{mentor.name}</h1>
              <p className="text-md text-muted-foreground flex items-center justify-center mt-1">
                <Briefcase className="h-4 w-4 mr-1.5 text-accent" />
                {mentor.role === 'mentor' ? 'Mentor' : 'User'} 
                {/* Could add a job title field to user profile later */}
              </p>
              {/* Placeholder for reviews */}
              {/* <div className="mt-3 flex items-center justify-center space-x-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-current' : ''}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(4.8 from 23 reviews)</span>
              </div> */}
              {canExpressInterest && (
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                    <Link href={`#express-interest`}>
                        <Mail className="h-4 w-4 mr-2" /> Contact {mentor.name.split(' ')[0]}
                    </Link>
                </Button>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-accent" /> Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mentor.availability || "Not specified"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">About {mentor.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-line leading-relaxed">{mentor.bio || "No bio provided."}</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <CheckCheck className="h-5 w-5 mr-2 text-accent" /> Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mentor.skills && mentor.skills.length > 0 ? mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm px-3 py-1 bg-accent/10 text-accent border-accent/30">
                  {skill}
                </Badge>
              )) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-accent" /> Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mentor.interests && mentor.interests.length > 0 ? mentor.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-sm px-3 py-1">
                  {interest}
                </Badge>
              )) : <p className="text-sm text-muted-foreground">No interests listed.</p>}
            </CardContent>
          </Card>
          
          {canExpressInterest && (
            <Card className="shadow-xl bg-card" id="express-interest">
                <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-accent" /> Express Interest
                </CardTitle>
                <CardDescription>
                    Ready to connect with {mentor.name}? Send a message to start the conversation.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <InterestForm mentorName={mentor.name} mentorId={mentor.id} />
                </CardContent>
            </Card>
          )}
          {!authUser && (
             <Card className="shadow-xl bg-card">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">Interested in {mentor.name}'s mentorship?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Please <Link href="/login" className="text-primary underline">log in</Link> or <Link href="/register" className="text-primary underline">sign up</Link> to express your interest.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
