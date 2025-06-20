
"use client";

import type { User, UserRole } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  register: (userData: User) => void; // Simplified register
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  "admin@example.com": {
    id: "admin001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    profilePictureUrl: "https://placehold.co/100x100/666699/F5F5FA.png?text=AU",
    bio: "System Administrator for MentorLink.",
    skills: ["User Management", "System Configuration"],
    interests: ["Platform Analytics"]
  },
  "mentor@example.com": {
    id: "mentor001",
    name: "Dr. Eleanor Vance",
    email: "mentor@example.com",
    role: "mentor",
    profilePictureUrl: "https://placehold.co/100x100/996699/FAF5FA.png?text=EV",
    bio: "Passionate AI researcher eager to guide aspiring data scientists.",
    skills: ["Machine Learning", "Python", "NLP"],
    interests: ["AI Ethics", "Academic Writing"],
    availability: "Weekends, Tuesday evenings"
  },
  "mentee@example.com": {
    id: "mentee001",
    name: "Alex Johnson",
    email: "mentee@example.com",
    role: "mentee",
    profilePictureUrl: "https://placehold.co/100x100/669999/F0F5F5.png?text=AJ",
    bio: "Aspiring software developer learning React and Node.js.",
    skills: ["JavaScript", "HTML", "CSS"],
    interests: ["Web Development", "Open Source"],
    availability: "Evenings and weekends"
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status on mount (e.g., from localStorage or Firebase)
    const storedUser = localStorage.getItem('mentorlink-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userDataFromForm: { email: string, role?: UserRole }) => {
    setLoading(true);
    // Simulate API call & Firebase Auth
    setTimeout(() => {
      const foundUser = mockUsers[userDataFromForm.email];
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('mentorlink-user', JSON.stringify(foundUser));
        // Redirect based on role
        if (foundUser.role === 'admin') router.push('/dashboard/admin');
        else if (foundUser.role === 'mentor') router.push('/dashboard/mentor');
        else router.push('/dashboard/mentee');
      } else {
        // Handle login failure (e.g., show toast)
        console.error("Login failed: User not found");
      }
      setLoading(false);
    }, 500);
  };

  const register = (userDataFromForm: User) => {
    setLoading(true);
    // Simulate API call & Firebase Auth
    setTimeout(() => {
      // In a real app, you'd create the user in Firebase Auth & Firestore
      // For mock, we just use the provided data and add to our mockUsers if needed
      const newUser: User = { ...userDataFromForm, id: `user-${Date.now()}` };
      mockUsers[newUser.email] = newUser; // Add to in-memory mock for this session
      setUser(newUser);
      localStorage.setItem('mentorlink-user', JSON.stringify(newUser));
      
      // Redirect to profile creation first, then dashboard
      router.push('/profile/create'); // Or directly to dashboard if profile setup is part of registration
      setLoading(false);
    }, 500);
  };


  const logout = () => {
    setLoading(true);
    // Simulate Firebase Auth signout
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('mentorlink-user');
      router.push('/login');
      setLoading(false);
    }, 500);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
