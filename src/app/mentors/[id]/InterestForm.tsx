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

const formSchema = z.object({
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

interface InterestFormProps {
  mentorName: string;
  mentorId: string;
}

export function InterestForm({ mentorName, mentorId }: InterestFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: `Hi ${mentorName}, I'm interested in learning more about your mentorship.`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Interest form submission for mentor ID:", mentorId, "Values:", values);
    toast({
      title: "Interest Expressed!",
      description: `Your message has been sent to ${mentorName}.`,
    });
    form.reset({ message: `Hi ${mentorName}, I'm interested in learning more about your mentorship.`});
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
                Keep it concise and professional (max 500 characters).
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
