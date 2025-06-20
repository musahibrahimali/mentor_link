import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSetupForm } from "./ProfileSetupForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function CreateProfilePage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Complete Your Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Help others get to know you better. This information will be visible on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-primary/10 border-primary/30">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Almost there!</AlertTitle>
            <AlertDescription className="text-primary/80">
              Please fill out the details below to activate your MentorLink profile. 
              The more information you provide, the better we can match you with suitable mentors or mentees.
            </AlertDescription>
          </Alert>
          <ProfileSetupForm />
        </CardContent>
      </Card>
    </div>
  );
}
