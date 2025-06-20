import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, CalendarCheck, MessageSquare, Search, UserPlus, Lightbulb } from "lucide-react";
import type { Testimonial } from "@/types";

const features = [
  {
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: "Easy Profile Creation",
    description: "Quickly set up your mentor or mentee profile with your skills, interests, and goals.",
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Smart Matching",
    description: "Our AI-powered system helps you find the perfect mentor or mentee based on compatibility.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10 text-primary" />,
    title: "Seamless Scheduling",
    description: "Integrate with your calendar to easily schedule and manage mentorship sessions.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Direct Messaging",
    description: "Communicate securely with your mentor or mentee through our built-in messaging system.",
  },
];

const howItWorksSteps = [
  {
    id: 1,
    title: "Sign Up",
    description: "Create your account as a mentor or mentee in minutes.",
    icon: <Users className="h-8 w-8 text-accent" />,
  },
  {
    id: 2,
    title: "Build Your Profile",
    description: "Detail your expertise, interests, and what you're looking for.",
    icon: <Lightbulb className="h-8 w-8 text-accent" />,
  },
  {
    id: 3,
    title: "Find Your Match",
    description: "Browse profiles or get AI-powered suggestions.",
    icon: <Search className="h-8 w-8 text-accent" />,
  },
  {
    id: 4,
    title: "Connect & Grow",
    description: "Schedule sessions, chat, and start your mentorship journey.",
    icon: <CheckCircle className="h-8 w-8 text-accent" />,
  },
];

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah L.",
    role: "Mentee",
    quote: "MentorLink helped me find an incredible mentor who guided me through a major career transition. The platform is so easy to use!",
    imageUrl: "https://placehold.co/100x100.png",
  },
  {
    id: "2",
    name: "John B.",
    role: "Mentor",
    quote: "Being a mentor on MentorLink has been a rewarding experience. I've connected with amazing mentees and helped them achieve their goals.",
    imageUrl: "https://placehold.co/100x100.png",
  },
  {
    id: "3",
    name: "Emily K.",
    role: "Mentee",
    quote: "The AI matching feature is fantastic! It suggested a mentor whose expertise perfectly aligned with my learning objectives.",
    imageUrl: "https://placehold.co/100x100.png",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col items-center font-body">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary mb-6">
            Unlock Your Potential with MentorLink
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with experienced mentors or guide aspiring individuals.
            MentorLink is your bridge to growth and success.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href="/mentors">Find a Mentor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href="/register?role=mentor">Become a Mentor</Link>
            </Button>
          </div>
          <div className="mt-16">
            <Image 
              src="https://placehold.co/1200x600.png" 
              alt="Mentorship collaboration" 
              width={1200} 
              height={600} 
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="team collaboration"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-4 text-primary">
            Why Choose MentorLink?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            We provide a seamless and effective platform for mentors and mentees to connect, learn, and grow together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-12 text-primary">
            Get Started in Minutes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-background/50 transition-colors duration-300">
                <div className="p-4 bg-accent/20 rounded-full mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-headline font-medium mb-2 text-primary">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-12 text-primary">
            Loved by Mentors & Mentees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardContent className="pt-6">
                  <p className="italic text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} data-ai-hint="portrait person" />
                      <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-primary">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
            Ready to Start Your Mentorship Journey?
          </h2>
          <p className="text-lg md:text-xl opacity-80 max-w-xl mx-auto mb-8">
            Join MentorLink today and take the next step in your personal or professional development.
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-primary hover:bg-accent hover:text-accent-foreground">
            <Link href="/register">Join Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
