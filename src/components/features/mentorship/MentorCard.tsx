import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "@/types";
import { Briefcase, Star, MessageSquare, ExternalLink } from "lucide-react";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={mentor.profilePictureUrl || "https://placehold.co/600x400.png"}
            alt={mentor.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="professional portrait"
          />
           <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1 rounded-md flex items-center text-xs">
            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" /> 
            <span className="font-semibold text-foreground">4.8</span> 
            <span className="text-muted-foreground ml-1">(23)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-2xl mb-1 text-primary">{mentor.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 flex items-center">
          <Briefcase className="h-4 w-4 mr-1.5 text-accent" />
          {/* Placeholder for actual job title/role from profile if available */}
          Senior Software Engineer @ TechCorp 
        </CardDescription>
        
        <p className="text-sm text-foreground line-clamp-3 mb-4">
          {mentor.bio}
        </p>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal bg-accent/10 text-accent border-accent/30">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 3 && (
              <Badge variant="outline" className="font-normal">+{mentor.skills.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Button asChild className="w-full">
          <Link href={`/mentors/${mentor.id}`}>
            View Profile <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
