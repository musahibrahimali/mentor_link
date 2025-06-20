
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit3, Mail, Briefcase, GraduationCap, Lightbulb, Settings, CalendarDays, LogOut, UserCircle2, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl bg-card overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <Skeleton className="relative w-32 h-32 mb-4 rounded-full" />
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Separator />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-36" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl bg-card">
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-xl bg-card">
                    <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
                    <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                </Card>
                <Card className="shadow-xl bg-card">
                    <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
                    <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                </Card>
             </div>
          </div>
        </div>
      </div>
    );
  }
  
  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'mentor': return '/dashboard/mentor';
      case 'mentee': return '/dashboard/mentee';
      default: return '/profile'; // Should not happen if role is set
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin': return <ShieldCheck className="h-4 w-4 mr-1.5 text-accent" />;
      case 'mentor': return <Briefcase className="h-4 w-4 mr-1.5 text-accent" />;
      case 'mentee': return <GraduationCap className="h-4 w-4 mr-1.5 text-accent" />;
      default: return <UserCircle2 className="h-4 w-4 mr-1.5 text-accent" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <UserCircle2 className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-headline font-bold text-primary">My Profile</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/profile/create"> 
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Link>
          </Button>
           <Button variant="destructive" onClick={logout} disabled={loading}>
            <LogOut className="mr-2 h-4 w-4" /> {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl bg-card overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                <Image
                  src={user.profilePictureUrl || `https://placehold.co/200x200/cccccc/FFFFFF.png?text=${user.name?.substring(0,2).toUpperCase()}`}
                  alt={user.name || "User"}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="profile avatar"
                />
              </div>
              <h2 className="text-2xl font-headline font-semibold text-primary">{user.name}</h2>
              <p className="text-muted-foreground capitalize flex items-center">
                {getRoleIcon()}
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
                 {/* Placeholder for account settings page */}
                <Link href="#"><Settings className="mr-1.5 h-4 w-4" /> Account Settings</Link>
              </Button>
               <Button variant="link" asChild className="p-0 h-auto text-primary">
                <Link href={getDashboardPath()}><UserCircle2 className="mr-1.5 h-4 w-4" /> Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-line leading-relaxed">{user.bio || "No bio provided. Please edit your profile to add more details."}</p>
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
                  <p className="text-sm text-muted-foreground">No skills listed. Edit your profile to add them.</p>
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
                  <p className="text-sm text-muted-foreground">No interests listed. Edit your profile to add them.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
