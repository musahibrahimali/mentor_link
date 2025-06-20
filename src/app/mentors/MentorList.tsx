"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { MentorCard } from "@/components/features/mentorship/MentorCard";
import type { Mentor } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Eleanor Vance",
    email: "eleanor@example.com",
    role: "mentor",
    bio: "Passionate AI researcher with 10+ years in Machine Learning and Natural Language Processing. Eager to guide aspiring data scientists and AI enthusiasts.",
    skills: ["Machine Learning", "Python", "NLP", "Deep Learning", "Research"],
    interests: ["AI Ethics", "Reinforcement Learning", "Academic Writing"],
    availability: "Weekends, Tuesday evenings",
    profilePictureUrl: "https://placehold.co/300x300/666699/F5F5FA.png?text=EV",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus@example.com",
    role: "mentor",
    bio: "Full-stack developer and startup founder. I can help with web technologies (React, Node.js), product development, and entrepreneurial mindset.",
    skills: ["React", "Node.js", "TypeScript", "Product Management", "Agile"],
    interests: ["SaaS", "FinTech", "Growth Hacking"],
    availability: "Monday & Wednesday evenings",
    profilePictureUrl: "https://placehold.co/300x300/996699/FAF5FA.png?text=MC",
  },
  {
    id: "3",
    name: "Aisha Khan",
    email: "aisha@example.com",
    role: "mentor",
    bio: "UX Design Lead with a focus on user-centered design and accessibility. I love helping new designers build their portfolios and navigate the industry.",
    skills: ["UX Design", "UI Design", "Figma", "User Research", "Accessibility"],
    interests: ["Design Systems", "Inclusive Design", "Mobile UX"],
    availability: "Flexible, by appointment",
    profilePictureUrl: "https://placehold.co/300x300/669999/F0F5F5.png?text=AK",
  },
  {
    id: "4",
    name: "David Miller",
    email: "david@example.com",
    role: "mentor",
    bio: "Marketing strategist with experience in digital marketing, SEO, and content creation. Let's grow your brand or career in marketing!",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Analytics"],
    interests: ["E-commerce", "Brand Building", "Video Marketing"],
    availability: "Saturday mornings",
  },
];

export function MentorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    mockMentors.forEach(mentor => mentor.skills.forEach(skill => skillsSet.add(skill)));
    return Array.from(skillsSet).sort();
  }, []);

  const filteredMentors = useMemo(() => {
    return mockMentors.filter((mentor) => {
      const matchesSearchTerm =
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSkill = filterSkill === "all" || mentor.skills.includes(filterSkill);

      return matchesSearchTerm && matchesSkill;
    });
  }, [searchTerm, filterSkill]);

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="search-mentors" className="block text-sm font-medium text-muted-foreground mb-1">Search Mentors</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search-mentors"
                type="text"
                placeholder="Search by name, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="filter-skill" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Skill</label>
             <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger id="filter-skill" className="w-full">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">No mentors found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
