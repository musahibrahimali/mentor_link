
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'mentor' | 'mentee' | 'admin';

export interface User {
  id: string; // This will be Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills?: string[]; // Stored as an array of strings
  interests?: string[]; // Stored as an array of strings
  availability?: string;
  profilePictureUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isActive?: boolean; // For admin soft delete/deactivation
}

export interface Profile extends Omit<User, 'id' | 'email' | 'role' | 'isActive'> {
  // Profile specific fields if we decide to separate them strictly
  // For now, User interface holds all common profile fields
}

export interface Mentor extends User {
  // Mentor-specific fields, if any beyond User + Profile
}

export interface Mentee extends User {
  // Mentee-specific fields, if any beyond User + Profile
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Mentor' | 'Mentee';
  quote: string;
  imageUrl: string;
}

export interface SessionLog {
  id: string; // Firestore document ID
  mentorId: string; // User UID
  mentorName?: string; // For easier display
  menteeId: string; // User UID
  menteeName?: string; // For easier display
  sessionDate: Timestamp; // Firestore Timestamp
  topic: string;
  durationMinutes?: number; // Optional
  notes?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  // feedbackMentee?: string; // Consider separate feedback collection later
  // feedbackMentor?: string;
}

export interface MentorshipAssignment {
  id: string; // Firestore document ID
  mentorId: string; // User UID
  mentorName?: string; // For easier display
  menteeId: string; // User UID
  menteeName?: string; // For easier display
  startDate: Timestamp; // Firestore Timestamp
  status: 'active' | 'pending' | 'ended';
  createdAt?: Timestamp;
}
