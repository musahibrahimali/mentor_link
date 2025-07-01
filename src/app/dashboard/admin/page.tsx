
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Users, CalendarClock, ClipboardList, Trash2, Edit, Search, UserCog, PowerOff, Power } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where, Timestamp, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<MentorshipAssignment[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | undefined>(undefined);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>('');
  
  const [searchTerm, setSearchTerm] = useState('');


  const fetchAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // Fetch Users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersList);

      // Fetch Assignments
      const assignmentsSnapshot = await getDocs(collection(db, 'mentorships'));
      const assignmentsList = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MentorshipAssignment));
      setAssignments(assignmentsList);

      // Fetch Session Logs
      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const sessionsList = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionLog));
      setSessionLogs(sessionsList);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({ title: "Error", description: "Could not load platform data.", variant: "destructive" });
    }
    setIsLoadingData(false);
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== 'admin') {
        router.push('/login');
      } else {
        fetchAllData();
      }
    }
  }, [authUser, authLoading, router, fetchAllData]);

  const handleOpenEditUserDialog = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditingUserRole(userToEdit.role);
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUserRole = async () => {
    if (!editingUser || !editingUserRole) return;
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, { role: editingUserRole, updatedAt: serverTimestamp() });
      toast({ title: "User Updated", description: `${editingUser.name}'s role updated to ${editingUserRole}.` });
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: editingUserRole } : u));
      setIsEditUserDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({ title: "Error", description: "Failed to update user role.", variant: "destructive" });
    }
  };
  
  const handleToggleUserActiveStatus = async (userToToggle: User) => {
    if (!userToToggle) return;
    const newStatus = !(userToToggle.isActive === undefined ? true : userToToggle.isActive); // Default to active if undefined
    try {
      const userRef = doc(db, 'users', userToToggle.id);
      await updateDoc(userRef, { isActive: newStatus, updatedAt: serverTimestamp() });
      toast({ title: "User Status Updated", description: `${userToToggle.name} has been ${newStatus ? 'activated' : 'deactivated'}.` });
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, isActive: newStatus } : u));
    } catch (error) {
      console.error("Error toggling user active status:", error);
      toast({ title: "Error", description: "Failed to update user status.", variant: "destructive" });
    }
  };


  const handleCreateAssignment = async () => {
    if (!selectedMentorId || !selectedMenteeId) {
      toast({ title: "Error", description: "Please select both a mentor and a mentee.", variant: "destructive" });
      return;
    }
    if (selectedMentorId === selectedMenteeId) {
      toast({ title: "Error", description: "Mentor and mentee cannot be the same person.", variant: "destructive" });
      return;
    }

    // Check if assignment already exists
    const existingAssignment = assignments.find(a => a.mentorId === selectedMentorId && a.menteeId === selectedMenteeId && a.status === 'active');
    if (existingAssignment) {
        toast({ title: "Error", description: "This mentorship assignment already exists and is active.", variant: "destructive" });
        return;
    }

    try {
      const mentor = users.find(u => u.id === selectedMentorId);
      const mentee = users.find(u => u.id === selectedMenteeId);

      const newAssignmentRef = await addDoc(collection(db, 'mentorships'), {
        mentorId: selectedMentorId,
        mentorName: mentor?.name || 'N/A',
        menteeId: selectedMenteeId,
        menteeName: mentee?.name || 'N/A',
        startDate: Timestamp.now(),
        status: 'active',
        createdAt: serverTimestamp()
      });
      const newAssignment: MentorshipAssignment = {
        id: newAssignmentRef.id,
        mentorId: selectedMentorId,
        mentorName: mentor?.name || 'N/A',
        menteeId: selectedMenteeId,
        menteeName: mentee?.name || 'N/A',
        startDate: Timestamp.now(),
        status: 'active',
      };
      setAssignments(prev => [...prev, newAssignment]);
      toast({ title: "Assignment Created", description: `Assigned ${mentee?.name || 'Mentee'} to ${mentor?.name || 'Mentor'}.` });
      setIsAssignDialogOpen(false);
      setSelectedMentorId('');
      setSelectedMenteeId('');
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({ title: "Error", description: "Failed to create assignment.", variant: "destructive" });
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    // For Spark plan, we can delete the assignment document.
    // If we wanted to keep history, we might change status to 'ended'.
    if (!window.confirm("Are you sure you want to delete this assignment? This action cannot be undone.")) return;

    try {
        await deleteDoc(doc(db, "mentorships", assignmentId));
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        toast({ title: "Assignment Deleted", description: "The mentorship assignment has been removed.", variant: "destructive" });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        toast({ title: "Error", description: "Could not delete assignment.", variant: "destructive" });
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-12 px-4 space-y-8">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!authUser || authUser.role !== 'admin') {
    return <div className="container mx-auto py-12 px-4 text-center">Access Denied. Admins only.</div>;
  }
  
  const potentialMentors = users.filter(u => u.role === 'mentor' && (u.isActive === undefined || u.isActive === true));
  const potentialMentees = users.filter(u => u.role === 'mentee' && (u.isActive === undefined || u.isActive === true));

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-headline font-bold text-primary">Admin Dashboard</h1>
         {/* Add User button removed as per Spark plan simplification. Users register themselves. */}
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
              {users.filter(u=>u.role === 'mentor').length} Mentors, {users.filter(u=>u.role === 'mentee').length} Mentees, {users.filter(u=>u.role === 'admin').length} Admins
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
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Users className="mr-2 h-5 w-5" /> User Management
          </CardTitle>
          <CardDescription>View and manage user roles and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search users by name or email..." className="max-w-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium flex items-center">
                    <img src={u.profilePictureUrl || `https://placehold.co/40x40?text=${u.name.substring(0,2).toUpperCase()}`} alt={u.name} className="h-8 w-8 rounded-full mr-2" data-ai-hint="avatar person" />
                    {u.name}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant={u.role === 'admin' ? 'destructive' : u.role === 'mentor' ? 'secondary' : 'outline'}>{u.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={(u.isActive === undefined || u.isActive) ? 'default' : 'destructive'}>
                      {(u.isActive === undefined || u.isActive) ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="mr-1 hover:text-primary" onClick={() => handleOpenEditUserDialog(u)}><UserCog className="h-4 w-4" /></Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`mr-1 ${(u.isActive === undefined || u.isActive) ? 'hover:text-destructive' : 'hover:text-green-500'}`} 
                      onClick={() => handleToggleUserActiveStatus(u)}
                      title={(u.isActive === undefined || u.isActive) ? 'Deactivate User' : 'Activate User'}
                    >
                        {(u.isActive === undefined || u.isActive) ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {editingUser?.name}</DialogTitle>
            <DialogDescription>Change the role for this user.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Role</Label>
            <Select value={editingUserRole} onValueChange={(value: UserRole) => setEditingUserRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mentee">Mentee</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUserRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    <TableCell>{mentor?.name || assignment.mentorName || 'N/A'}</TableCell>
                    <TableCell>{mentee?.name || assignment.menteeName || 'N/A'}</TableCell>
                    <TableCell>{assignment.startDate instanceof Timestamp ? assignment.startDate.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell><Badge variant={assignment.status === 'active' ? 'default' : 'outline'}>{assignment.status}</Badge></TableCell>
                    <TableCell>
                      {/* Edit assignment (e.g. change status) could be added here */}
                      <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDeleteAssignment(assignment.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4"><PlusCircle className="mr-2 h-4 w-4" /> New Assignment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Assignment</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="mentor-select">Mentor</Label>
                  <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                    <SelectTrigger id="mentor-select"><SelectValue placeholder="Select a mentor" /></SelectTrigger>
                    <SelectContent>
                      {potentialMentors.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.email})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mentee-select">Mentee</Label>
                  <Select value={selectedMenteeId} onValueChange={setSelectedMenteeId}>
                    <SelectTrigger id="mentee-select"><SelectValue placeholder="Select a mentee" /></SelectTrigger>
                    <SelectContent>
                      {potentialMentees.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.email})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateAssignment}>Assign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <CalendarClock className="mr-2 h-5 w-5" /> Session Logs
          </CardTitle>
          <CardDescription>View history of mentorship sessions.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Search/filter for logs could be added here */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Mentee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {sessionLogs.map((log) => {
                const mentor = users.find(u => u.id === log.mentorId);
                const mentee = users.find(u => u.id === log.menteeId);
                return (
                  <TableRow key={log.id}>
                    <TableCell>{mentor?.name || log.mentorName ||'N/A'}</TableCell>
                    <TableCell>{mentee?.name || log.menteeName || 'N/A'}</TableCell>
                    <TableCell>{log.sessionDate instanceof Timestamp ? log.sessionDate.toDate().toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="truncate max-w-xs">{log.topic}</TableCell>
                    <TableCell><Badge variant={log.status === 'completed' ? 'default' : log.status === 'scheduled' ? 'secondary' : 'outline'}>{log.status || 'N/A'}</Badge></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Google Calendar scheduling placeholder - This is complex for Spark without backend. Kept minimal. */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Platform Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="outline" disabled>Schedule Call (GCal - Placeholder)</Button>
            <p className="text-sm text-muted-foreground">Advanced scheduling features (e.g., direct Google Calendar integration for users) would typically require more extensive setup or backend services.</p>
        </CardContent>
      </Card>
    </div>
  );
}
