
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegistrationForm } from "./RegistrationForm";
import { Skeleton } from '@/components/ui/skeleton';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If user is already logged in, redirect them from register page
      // Typically to their dashboard or profile page if role is set.
      // If profile creation is pending, AuthContext might redirect to /profile/create.
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'mentor') router.push('/dashboard/mentor');
      else if (user.role === 'mentee') router.push('/dashboard/mentee');
      else router.push('/profile'); // Fallback, or /profile/create if that's next step
    }
  }, [user, loading, router]);

  if (loading) {
     return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (user && !loading) { // If user is loaded and exists, don't show register form
      return <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">Redirecting...</div>;
  }
  
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Join MentorLink</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your account and start connecting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-accent transition-colors">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
