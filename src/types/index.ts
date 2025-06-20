
export type UserRole = 'mentor' | 'mentee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileId?: string; // This could be an ID to a more detailed profile in Firestore
  // For convenience in AuthContext, we can include some profile details directly
  bio?: string;
  skills?: string[];
  interests?: string[];
  availability?: string;
  profilePictureUrl?: string;
}

// Profile might be a more detailed, separate document in Firestore
export interface Profile {
  id: string; // Corresponds to profileId in User or could be same as userId
  userId: string;
  bio: string;
  skills: string[];
  interests: string[];
  availability?: string; 
  profilePictureUrl?: string;
  // Mentor-specific
  mentees?: string[]; // Array of mentee user IDs
  // Mentee-specific
  currentMentorId?: string; // Mentor user ID
}

// These types can be refined as data models in Firestore are finalized
export interface Mentor extends User {
  // Mentor-specific fields from Profile can be merged here if User is the primary document
  // Or this can extend Profile if Profile is the primary document fetched
  mentees?: string[]; 
}

export interface Mentee extends User {
  // Mentee-specific fields
  currentMentorId?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Mentor' | 'Mentee';
  quote: string;
  imageUrl: string;
}

export interface SessionLog {
  id: string;
  mentorId: string;
  menteeId: string;
  sessionDate: string; // ISO string or Timestamp
  durationMinutes: number;
  notes?: string;
  feedbackMentee?: string;
  feedbackMentor?: string;
}

export interface MentorshipAssignment {
  id: string;
  mentorId: string;
  menteeId: string;
  startDate: string; // ISO string or Timestamp
  status: 'active' | 'pending' | 'ended';
}
