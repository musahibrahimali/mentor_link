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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

const formSchema = z.object({
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio must not exceed 500 characters." }),
  skills: z.string().min(1, { message: "Please list at least one skill." }),
  interests: z.string().min(1, { message: "Please list at least one interest." }),
  availability: z.string().optional(),
});

export function ProfileSetupForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      skills: "",
      interests: "",
      availability: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Profile values:", values);
    // In a real app, you would save this data to Firestore.
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    router.push("/profile"); // Redirect to view profile or dashboard
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
        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Profile</>}
        </Button>
      </form>
    </Form>
  );
}
