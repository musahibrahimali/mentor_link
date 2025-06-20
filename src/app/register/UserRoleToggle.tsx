"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UserRole } from "@/types";
import { Briefcase, GraduationCap } from "lucide-react";

interface UserRoleToggleProps {
  value: UserRole | undefined;
  onChange: (value: UserRole) => void;
}

export function UserRoleToggle({ value, onChange }: UserRoleToggleProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as UserRole)}
      className="grid grid-cols-2 gap-4"
    >
      <div>
        <RadioGroupItem value="mentee" id="mentee" className="peer sr-only" />
        <Label
          htmlFor="mentee"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
        >
          <GraduationCap className="mb-3 h-8 w-8" />
          I want to be a Mentee
        </Label>
      </div>
      <div>
        <RadioGroupItem value="mentor" id="mentor" className="peer sr-only" />
        <Label
          htmlFor="mentor"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
        >
          <Briefcase className="mb-3 h-8 w-8" />
          I want to be a Mentor
        </Label>
      </div>
    </RadioGroup>
  );
}
