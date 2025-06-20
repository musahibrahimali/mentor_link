
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

// Skills and interests will now be comma-separated strings in the form,
// but AuthContext's updateUserProfile will handle converting them to arrays for Firestore.
const formSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio must not exceed 500 characters." }),
  skills: z.string().min(1, { message: "Please list at least one skill (comma-separated)." }),
  interests: z.string().min(1, { message: "Please list at least one interest (comma-separated)." }),
  availability: z.string().optional(),
  profilePictureUrl: z.string().url({ message: "Please enter a valid URL for your profile picture." }).optional().or(z.literal('')),
});

export function ProfileSetupForm() {
  const { user, updateUserProfile, loading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      skills: "",
      interests: "",
      availability: "",
      profilePictureUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        bio: user.bio || "",
        // Convert arrays back to comma-separated strings for the form
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
        interests: Array.isArray(user.interests) ? user.interests.join(", ") : "",
        availability: user.availability || "",
        profilePictureUrl: user.profilePictureUrl || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateUserProfile(values);
    // Redirection to /profile is handled by updateUserProfile in AuthContext
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself, your experience, and what you're looking for in a mentorship."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief introduction (max 500 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., JavaScript, Project Management, Public Speaking" {...field} />
              </FormControl>
              <FormDescription>
                List your key skills, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Web Development, AI, Entrepreneurship, Photography" {...field} />
              </FormControl>
              <FormDescription>
                List your interests or areas you&apos;d like to focus on, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekday evenings, Weekend mornings" {...field} />
              </FormControl>
              <FormDescription>
                Let others know when you are generally available for mentorship sessions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="profilePictureUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/your-image.png" {...field} />
              </FormControl>
              <FormDescription>
                Link to your profile picture. Use a service like Imgur or a direct link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={authLoading || form.formState.isSubmitting}>
          {authLoading || form.formState.isSubmitting ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
        </Button>
      </form>
    </Form>
  );
}
