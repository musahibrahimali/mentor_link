import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, Profile } from "@/types"; // Assuming combined type or separate fetch
import Link from "next/link";
import { Edit3, Mail, Briefcase, GraduationCap, Lightbulb, Settings, CalendarDays, LogOut, UserCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MentorCard } from "@/components/features/mentorship/MentorCard"; // For AI suggested mentors
import type { Mentor } from "@/types";

// Mock data for the current user's profile
const mockCurrentUser: User & Partial<Profile> = {
  id: "currentUser123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "mentee", // Can be 'mentor' or 'mentee'
  bio: "Aspiring software developer eager to learn about full-stack development and cloud technologies. Currently working on personal projects with React and Node.js. Looking for guidance on career progression and best practices in software engineering.",
  skills: ["JavaScript", "React", "HTML", "CSS", "Git"],
  interests: ["Web Development", "Cloud Computing", "AI", "Open Source"],
  availability: "Evenings and weekends",
  profilePictureUrl: "https://placehold.co/200x200/666699/F5F5FA.png?text=AJ",
};

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


export default function UserProfilePage() {
  const user = mockCurrentUser; // In a real app, fetch current user data

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <UserCircle className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-headline font-bold text-primary">My Profile</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/profile/edit"> {/* Assuming an edit page route */}
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
           <Button variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl bg-card overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                <Image
                  src={user.profilePictureUrl || "https://placehold.co/200x200.png"}
                  alt={user.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="profile avatar"
                />
              </div>
              <h2 className="text-2xl font-headline font-semibold text-primary">{user.name}</h2>
              <p className="text-muted-foreground capitalize flex items-center">
                {user.role === 'mentor' ? <Briefcase className="h-4 w-4 mr-1.5 text-accent" /> : <GraduationCap className="h-4 w-4 mr-1.5 text-accent" />}
                {user.role}
              </p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center">
                <Mail className="h-4 w-4 mr-1.5 text-accent" />
                {user.email}
              </p>
            </div>
            <Separator />
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-2 text-accent" />
                <span>Availability: {user.availability || "Not specified"}</span>
              </div>
               <Button variant="link" asChild className="p-0 h-auto text-primary">
                <Link href="/profile/settings"><Settings className="mr-1.5 h-4 w-4" /> Account Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-line leading-relaxed">{user.bio || "No bio provided."}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-primary flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-accent" />Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-accent/10 text-accent border-accent/30">{skill}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-primary">Interests</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.interests && user.interests.length > 0 ? (
                  user.interests.map((interest) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests listed.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* AI Suggested Mentors (for Mentees) */}
          {user.role === 'mentee' && (
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Recommended Mentors</CardTitle>
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
          )}

          {/* Mentee Requests (for Mentors) - Placeholder */}
          {user.role === 'mentor' && (
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Mentee Requests</CardTitle>
                <CardDescription>View and manage requests from potential mentees.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No new mentee requests at this time.</p>
                {/* Placeholder for list of requests */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
