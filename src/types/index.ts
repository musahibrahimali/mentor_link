export type UserRole = 'mentor' | 'mentee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileId?: string;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  interests: string[];
  availability?: string; // e.g., "Weekends", "Weekdays after 5 PM"
  profilePictureUrl?: string;
}

export interface Mentor extends User, Profile {}

export interface Mentee extends User, Profile {}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Mentor' | 'Mentee';
  quote: string;
  imageUrl: string;
}
