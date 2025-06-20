
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MentorCard } from "@/components/features/mentorship/MentorCard";
import type { Mentor } from "@/types"; // Ensure Mentor type is comprehensive
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function MentorList() {
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const { toast } = useToast();

  const fetchMentors = useCallback(async () => {
    setIsLoading(true);
    try {
      const mentorsQuery = query(collection(db, "users"), where("role", "==", "mentor"), where("isActive", "==", true));
      const querySnapshot = await getDocs(mentorsQuery);
      const mentorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mentor));
      setAllMentors(mentorsList);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast({ title: "Error", description: "Could not load mentors.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const allSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    allMentors.forEach(mentor => {
      if (mentor.skills && Array.isArray(mentor.skills)) {
        mentor.skills.forEach(skill => skillsSet.add(skill));
      }
    });
    return Array.from(skillsSet).sort();
  }, [allMentors]);

  const filteredMentors = useMemo(() => {
    return allMentors.filter((mentor) => {
      const nameMatch = mentor.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const bioMatch = mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      const skillsMatch = mentor.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSearchTerm = nameMatch || bioMatch || skillsMatch;
      
      const matchesSkill = filterSkill === "all" || (mentor.skills && mentor.skills.includes(filterSkill));

      return matchesSearchTerm && matchesSkill;
    });
  }, [allMentors, searchTerm, filterSkill]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

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
                placeholder="Search by name, bio, skill..."
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
                <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by skill" />
                </div>
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
