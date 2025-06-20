
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, LogOut, UserCircle, Edit, LayoutDashboard, Briefcase, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';

const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
  <>
    <Button variant="ghost" asChild>
      <Link href="/mentors" onClick={onLinkClick}>Find a Mentor</Link>
    </Button>
    <Button variant="ghost" asChild>
      <Link href="/#how-it-works" onClick={onLinkClick}>How It Works</Link>
    </Button>
    <Button variant="ghost" asChild>
      <Link href="/#testimonials" onClick={onLinkClick}>Testimonials</Link>
    </Button>
  </>
);

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'mentor': return '/dashboard/mentor';
      case 'mentee': return '/dashboard/mentee';
      default: return '/profile';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getFirstName = (name?: string) => {
    if (!name) return "";
    return name.split(' ')[0];
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 h-auto rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePictureUrl} alt={user.name} data-ai-hint="profile avatar" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">{getFirstName(user.name)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  {user.role === 'mentor' ? <Briefcase className="mr-2 h-4 w-4" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile/create')}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-2 mt-8">
                  <SheetClose asChild><NavLinks onLinkClick={() => {}} /></SheetClose>
                  {!user && (
                    <>
                      <SheetClose asChild>
                        <Button variant="outline" asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild>
                          <Link href="/register">Sign Up</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
