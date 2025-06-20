
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, CalendarClock, ClipboardList, Trash2, Edit, Search } from 'lucide-react';
import type { User, MentorshipAssignment, SessionLog, UserRole } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';


// Mock Data
const mockUsersData: User[] = [
  { id: "mentor001", name: "Dr. Eleanor Vance", email: "mentor@example.com", role: "mentor", profilePictureUrl: "https://placehold.co/40x40/996699/FAF5FA.png?text=EV" },
  { id: "mentee001", name: "Alex Johnson", email: "mentee@example.com", role: "mentee", profilePictureUrl: "https://placehold.co/40x40/669999/F0F5F5.png?text=AJ" },
  { id: "mentor002", name: "Marcus Chen", email: "marcus.chen@example.com", role: "mentor", profilePictureUrl: "https://placehold.co/40x40/666699/F5F5FA.png?text=MC" },
  { id: "mentee002", name: "Sarah Lee", email: "sarah.lee@example.com", role: "mentee", profilePictureUrl: "https://placehold.co/40x40/FFC0CB/000000.png?text=SL" },
];

const mockAssignmentsData: MentorshipAssignment[] = [
  { id: "assign001", mentorId: "mentor001", menteeId: "mentee001", startDate: new Date().toISOString(), status: "active" },
  { id: "assign002", mentorId: "mentor002", menteeId: "mentee002", startDate: new Date(Date.now() - 1000*60*60*24*30).toISOString(), status: "active" },
];

const mockSessionLogsData: SessionLog[] = [
  { id: "log001", mentorId: "mentor001", menteeId: "mentee001", sessionDate: new Date(Date.now() - 1000*60*60*24*7).toISOString(), durationMinutes: 60, notes: "Discussed career goals." },
  { id: "log002", mentorId: "mentor002", menteeId: "mentee002", sessionDate: new Date(Date.now() - 1000*60*60*24*14).toISOString(), durationMinutes: 45, notes: "Reviewed project progress." },
];


export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>(mockUsersData);
  const [assignments, setAssignments] = useState<MentorshipAssignment[]>(mockAssignmentsData);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(mockSessionLogsData);
  
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('mentee');


  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="container mx-auto py-12 px-4 text-center">Loading admin dashboard...</div>;
  }
  
  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      profilePictureUrl: `https://placehold.co/40x40?text=${newUserName.substring(0,2).toUpperCase()}`
    };
    setUsers(prev => [...prev, newUser]);
    toast({ title: "User Added", description: `${newUserName} has been added as a ${newUserRole}.` });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('mentee');
    setIsAddUserDialogOpen(false);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setAssignments(prev => prev.filter(a => a.mentorId !== userId && a.menteeId !== userId));
    setSessionLogs(prev => prev.filter(s => s.mentorId !== userId && s.menteeId !== userId));
    toast({ title: "User Removed", description: `User ${userId} has been removed.`, variant: "destructive" });
  };


  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Admin Dashboard</h1>
         <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-5 w-5" /> Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new mentor or mentee account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="col-span-3" placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="col-span-3" placeholder="user@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <RadioGroup defaultValue="mentee" value={newUserRole} onValueChange={(value: UserRole) => setNewUserRole(value)} className="col-span-3 flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentee" id="r-mentee" />
                    <Label htmlFor="r-mentee">Mentee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mentor" id="r-mentor" />
                    <Label htmlFor="r-mentor">Mentor</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u=>u.role === 'mentor').length} Mentors, {users.filter(u=>u.role === 'mentee').length} Mentees
            </p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Total mentorship pairs</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logged Sessions</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionLogs.length}</div>
            <p className="text-xs text-muted-foreground">Total sessions recorded</p>
          </CardContent>
        </Card>
      </div>
      
      {/* User Management Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Users className="mr-2 h-5 w-5" /> User Management
          </CardTitle>
          <CardDescription>View, add, or remove users from the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search users..." className="max-w-sm" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium flex items-center">
                    <img src={u.profilePictureUrl || `https://placehold.co/40x40?text=${u.name.substring(0,2).toUpperCase()}`} alt={u.name} className="h-8 w-8 rounded-full mr-2" data-ai-hint="avatar" />
                    {u.name}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant={u.role === 'admin' ? 'destructive' : u.role === 'mentor' ? 'secondary' : 'outline'}>{u.role}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleRemoveUser(u.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mentorship Assignments Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" /> Mentorship Assignments
          </CardTitle>
          <CardDescription>Manage mentor-mentee pairings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const mentor = users.find(u => u.id === assignment.mentorId);
                const mentee = users.find(u => u.id === assignment.menteeId);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>{mentor?.name || 'N/A'}</TableCell>
                    <TableCell>{mentee?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant={assignment.status === 'active' ? 'default' : 'outline'}>{assignment.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="mr-1 hover:text-primary"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
           <Button variant="outline" className="mt-4"><PlusCircle className="mr-2 h-4 w-4" /> New Assignment</Button>
        </CardContent>
      </Card>

      {/* Session Logs Section */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" /> Session Logs & Feedback
          </CardTitle>
          <CardDescription>View history of mentorship sessions and feedback.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
              <Input placeholder="Search logs by user or date..." className="max-w-sm" />
            </div>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {sessionLogs.map((log) => {
                const mentor = users.find(u => u.id === log.mentorId);
                const mentee = users.find(u => u.id === log.menteeId);
                return (
                  <TableRow key={log.id}>
                    <TableCell>{mentor?.name || 'N/A'}</TableCell>
                    <TableCell>{mentee?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(log.sessionDate).toLocaleDateString()}</TableCell>
                    <TableCell>{log.durationMinutes} min</TableCell>
                    <TableCell className="truncate max-w-xs">{log.notes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
           </Table>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Platform Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="outline" disabled>Schedule Call (Google Calendar - Placeholder)</Button>
            <p className="text-sm text-muted-foreground">Functionality to schedule calls on behalf of users via Google Calendar will be here.</p>
        </CardContent>
      </Card>

    </div>
  );
}
