
"use client";

import type { User, UserRole } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<void>; // Password optional for Google
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  register: (registrationData: Pick<User, 'name' | 'email' | 'role'> & {password: string}) => Promise<void>;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as User;
           if (userData.isActive === false) { // Check for deactivated user
            await firebaseSignOut(auth);
            setUser(null);
            localStorage.removeItem('mentorlink-user');
            toast({ title: "Account Deactivated", description: "Your account has been deactivated. Please contact support.", variant: "destructive"});
            router.push('/login');
          } else {
            setUser({ ...userData, id: firebaseUser.uid, email: firebaseUser.email || userData.email }); // Ensure email from auth is used
            localStorage.setItem('mentorlink-user', JSON.stringify({ ...userData, id: firebaseUser.uid, email: firebaseUser.email || userData.email }));
          }
        } else {
          // This case handles users who signed up (e.g. via Google) but don't have a Firestore record yet.
          // Or if Firestore doc creation failed during email/password signup.
          // For Google new users, we create a basic profile and redirect.
          if (firebaseUser.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID)) {
            const newUserProfile: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "New User",
              email: firebaseUser.email!,
              role: 'mentee', // Default role for new Google sign-ups
              profilePictureUrl: firebaseUser.photoURL || undefined,
              createdAt: serverTimestamp() as Timestamp,
              isActive: true,
            };
            await setDoc(userRef, newUserProfile);
            setUser(newUserProfile);
            localStorage.setItem('mentorlink-user', JSON.stringify(newUserProfile));
            router.push('/profile/create'); // Guide to complete profile
          } else {
             // For email/pass, if doc is missing, it's an anomaly. Log out.
            await firebaseSignOut(auth);
            setUser(null);
            localStorage.removeItem('mentorlink-user');
            router.push('/login');
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('mentorlink-user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, toast]);
  
  const login = async (credentials: { email: string; password?: string }) => {
    setLoading(true);
    try {
      if (!credentials.password) throw new Error("Password is required for email login.");
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      // onAuthStateChanged will handle setting user state and redirecting
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setUser(null); // Ensure user is null on failure
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged handles the rest, including new user doc creation if needed.
      toast({ title: "Signed in with Google", description: "Welcome!" });
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registrationData: Pick<User, 'name' | 'email' | 'role'> & {password: string}) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registrationData.email, registrationData.password);
      const firebaseUser = userCredential.user;
      
      const newUserProfile: User = {
        id: firebaseUser.uid,
        name: registrationData.name,
        email: registrationData.email,
        role: registrationData.role,
        createdAt: serverTimestamp() as Timestamp,
        isActive: true,
        profilePictureUrl: firebaseUser.photoURL || `https://placehold.co/100x100?text=${registrationData.name.substring(0,2).toUpperCase()}`,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUserProfile);
      // onAuthStateChanged will set user state.
      toast({ title: "Registration Successful", description: "Your account has been created." });
      router.push('/profile/create'); 
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (profileData: Partial<Omit<User, 'id' | 'email' | 'role' | 'createdAt'>>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      const updateData = { ...profileData, updatedAt: serverTimestamp() as Timestamp };
      
      // Convert comma-separated strings to arrays for skills and interests if they exist
      if (typeof profileData.skills === 'string') {
        updateData.skills = profileData.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      if (typeof profileData.interests === 'string') {
        updateData.interests = profileData.interests.split(',').map(i => i.trim()).filter(i => i);
      }

      await updateDoc(userRef, updateData);
      
      // Update local user state
      setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...updateData } as User; // Cast needed due to serverTimestamp
         if (updateData.skills) updatedUser.skills = updateData.skills as string[];
         if (updateData.interests) updatedUser.interests = updateData.interests as string[];
        localStorage.setItem('mentorlink-user', JSON.stringify(updatedUser));
        return updatedUser;
      });

      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      router.push('/profile');
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast({ title: "Profile Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem('mentorlink-user');
      router.push('/login');
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, logout, register, updateUserProfile }}>
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
