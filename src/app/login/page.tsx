
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
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
    // Show loading or null if user exists to prevent flash of login page
    return <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue your mentorship journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-accent transition-colors">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
