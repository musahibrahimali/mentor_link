
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formSchema = z.object({
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

interface InterestFormProps {
  mentorName: string;
  mentorId: string;
}

export function InterestForm({ mentorName, mentorId }: InterestFormProps) {
  const { toast } = useToast();
  const { user: authUser } = useAuth(); // Get current authenticated user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: `Hi ${mentorName}, I'm interested in learning more about your mentorship. My name is ${authUser?.name || ''} and I'm looking for guidance in...`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!authUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to send a message.", variant: "destructive" });
      return;
    }

    // Simulate API call - In a real app, this would create a "message" or "interest" document in Firestore.
    // Example: Save to a "interestRequests" collection
    try {
      await addDoc(collection(db, "interestRequests"), {
        mentorId: mentorId,
        mentorName: mentorName,
        menteeId: authUser.id,
        menteeName: authUser.name,
        menteeEmail: authUser.email,
        message: values.message,
        status: "pending", // Initial status
        requestedAt: serverTimestamp(),
      });

      toast({
        title: "Interest Expressed!",
        description: `Your message has been sent to ${mentorName}. They will be notified.`,
      });
      form.reset({ message: `Hi ${mentorName}, I'm interested in learning more about your mentorship.`});
    } catch (error) {
        console.error("Error sending interest request:", error);
        toast({ title: "Error", description: "Could not send your message. Please try again.", variant: "destructive"});
    }
  }

  if (!authUser) {
    return <p className="text-muted-foreground">Please log in to express interest.</p>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message to {mentorName}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Introduce yourself and explain why you're interested in ${mentorName}'s mentorship...`}
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Keep it concise and professional (max 500 characters). This will be sent to {mentorName}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : <><Send className="mr-2 h-4 w-4" /> Send Interest</>}
        </Button>
      </form>
    </Form>
  );
}
