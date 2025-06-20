
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { RegistrationForm } from "./RegistrationForm";

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to a relevant page, e.g., dashboard or profile
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'mentor') router.push('/dashboard/mentor');
      else router.push('/dashboard/mentee');
    }
  }, [user, loading, router]);

  if (loading || user) {
    // Show loading or null if user exists to prevent flash of register page
    return <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">Loading...</div>;
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
