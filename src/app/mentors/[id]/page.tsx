import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mentor } from "@/types";
import { InterestForm } from "./InterestForm";
import { Briefcase, CalendarDays, CheckCheck, GraduationCap, Lightbulb, Mail, MapPin, MessageSquare, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, this would be fetched based on params.id
const mockMentors: Mentor[] = [
   {
    id: "1",
    name: "Dr. Eleanor Vance",
    email: "eleanor@example.com",
    role: "mentor",
    bio: "Passionate AI researcher with 10+ years in Machine Learning and Natural Language Processing. My work focuses on developing ethical and robust AI systems. I've mentored several students and professionals, helping them navigate complex projects and career paths in data science. I believe in a hands-on approach to mentorship, encouraging critical thinking and practical application of knowledge. Looking forward to connecting with individuals who are curious and driven to make an impact in the AI field.",
    skills: ["Machine Learning", "Python", "NLP", "Deep Learning", "Research", "AI Ethics", "TensorFlow", "PyTorch"],
    interests: ["AI Ethics", "Reinforcement Learning", "Academic Writing", "Quantum Computing", "Philosophy of Mind"],
    availability: "Weekends, Tuesday evenings (PST)",
    profilePictureUrl: "https://placehold.co/300x300/666699/F5F5FA.png?text=EV",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus@example.com",
    role: "mentor",
    bio: "Full-stack developer and serial entrepreneur with two successful exits. My expertise lies in building scalable web applications using modern JavaScript frameworks and cloud technologies. I can help with everything from initial idea validation to technical architecture, product development, and go-to-market strategy. I'm particularly interested in mentoring aspiring founders and developers looking to build impactful SaaS products.",
    skills: ["React", "Node.js", "TypeScript", "Product Management", "Agile", "AWS", "GraphQL", "Startup Funding"],
    interests: ["SaaS", "FinTech", "Growth Hacking", "Angel Investing", "Distributed Systems"],
    availability: "Monday & Wednesday evenings (EST)",
    profilePictureUrl: "https://placehold.co/300x300/996699/FAF5FA.png?text=MC",
  },
   {
    id: "3",
    name: "Aisha Khan",
    email: "aisha@example.com",
    role: "mentor",
    bio: "UX Design Lead with a strong focus on creating intuitive, user-centered, and accessible digital experiences. I have extensive experience in leading design teams, conducting user research, and implementing design systems. I'm passionate about helping new designers build strong portfolios, master design tools like Figma, and navigate the complexities of the UX industry. My mentorship style is collaborative and feedback-driven.",
    skills: ["UX Design", "UI Design", "Figma", "User Research", "Accessibility", "Design Systems", "Prototyping", "Interaction Design"],
    interests: ["Inclusive Design", "Mobile UX", "Service Design", "Design Leadership", "Ethical Design"],
    availability: "Flexible, by appointment",
    profilePictureUrl: "https://placehold.co/300x300/669999/F0F5F5.png?text=AK",
  },
   {
    id: "4",
    name: "David Miller",
    email: "david@example.com",
    role: "mentor",
    bio: "Seasoned marketing strategist with over 15 years of experience in digital marketing, SEO, content creation, and brand development. I've worked with both startups and Fortune 500 companies to craft and execute impactful marketing campaigns. I can provide guidance on developing comprehensive marketing plans, optimizing online presence, and leveraging data analytics for growth. Looking to mentor marketing professionals at all levels.",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media Marketing", "Google Analytics", "PPC Advertising", "Brand Management", "Email Marketing"],
    interests: ["E-commerce", "Brand Building", "Video Marketing", "Marketing Automation", "Consumer Psychology"],
    availability: "Saturday mornings (CST)",
  },
];


export default function MentorProfilePage({ params }: { params: { id: string } }) {
  const mentor = mockMentors.find(m => m.id === params.id);

  if (!mentor) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-destructive">Mentor Not Found</h1>
        <p className="text-muted-foreground mt-2">The mentor profile you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/mentors">Back to Mentors List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8 sticky top-24">
           <Card className="shadow-xl overflow-hidden bg-card">
            <div className="relative h-64 w-full">
              <Image
                src={mentor.profilePictureUrl || "https://placehold.co/400x400.png"}
                alt={mentor.name}
                layout="fill"
                objectFit="cover"
                data-ai-hint="professional headshot"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h1 className="text-3xl font-headline font-bold text-primary">{mentor.name}</h1>
              <p className="text-md text-muted-foreground flex items-center justify-center mt-1">
                <Briefcase className="h-4 w-4 mr-1.5 text-accent" />
                {/* Placeholder, replace with actual role/title */}
                Senior AI Researcher 
              </p>
              <div className="mt-3 flex items-center justify-center space-x-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-current' : ''}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(4.8 from 23 reviews)</span>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Mail className="h-4 w-4 mr-2" /> Contact {mentor.name.split(' ')[0]}
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-accent" /> Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mentor.availability || "Not specified"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details and Interest Form */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">About {mentor.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-line leading-relaxed">{mentor.bio}</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <CheckCheck className="h-5 w-5 mr-2 text-accent" /> Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm px-3 py-1 bg-accent/10 text-accent border-accent/30">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-accent" /> Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mentor.interests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-sm px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </CardContent>
          </Card>
          
          <Card className="shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-accent" /> Express Interest
              </CardTitle>
              <CardDescription>
                Ready to connect with {mentor.name}? Send a message to start the conversation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InterestForm mentorName={mentor.name} mentorId={mentor.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
