'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeacherAttendance } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { faculty as allFaculty, courseAssignments as allAssignments } from '@/lib/data';

function getStatusBadgeVariant(status: TeacherAttendance['status']) {
  switch (status) {
    case 'Présent':
      return 'default';
    case 'Absent':
      return 'destructive';
    case 'Justifié':
      return 'secondary';
    default:
      return 'outline';
  }
}

function AddAttendanceForm({ onAddEntry }: { onAddEntry: (entry: TeacherAttendance) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [teacherId, setTeacherId] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [date, setDate] = React.useState('');
  const [status, setStatus] = React.useState<TeacherAttendance['status']>('Présent');
  const [remarks, setRemarks] = React.useState('');
  
  const teacherCourses = allAssignments.filter(a => a.teacherId === teacherId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);
    const course = allAssignments.find(a => a.courseCode === courseCode);
    
    if (!teacher || !course || !date || !status) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newEntry: TeacherAttendance = {
      id: `ATT${Date.now()}`,
      teacherId,
      teacherName: teacher.name,
      courseName: course.courseName,
      courseCode: course.courseCode,
      date,
      status,
      remarks,
    };

    onAddEntry(newEntry);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseCode('');
    setDate('');
    setStatus('Présent');
    setRemarks('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Marquer une présence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Marquer une présence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>{allFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Cours</Label>
              <Select onValueChange={setCourseCode} value={courseCode} disabled={!teacherId}>
                <SelectTrigger id="course"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {teacherCourses.map(c => <SelectItem key={c.courseCode} value={c.courseCode}>{c.courseName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select onValueChange={(val: TeacherAttendance['status']) => setStatus(val)} value={status}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Présent">Présent</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Justifié">Justifié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarques</Label>
              <Textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optionnel" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function AttendanceTable({ data }: { data: TeacherAttendance[] }) {
  const [attendance, setAttendance] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAttendance = attendance.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddEntry = (newEntry: TeacherAttendance) => {
    setAttendance(prev => [...prev, newEntry]);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      setAttendance(attendance.filter(a => a.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feuille de présence</CardTitle>
            <CardDescription>Liste des présences enregistrées pour les cours.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <AddAttendanceForm onAddEntry={handleAddEntry} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Remarques</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length > 0 ? filteredAttendance.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.teacherName}</TableCell>
                  <TableCell>
                      <div>{item.courseName}</div>
                      <div className="text-xs text-muted-foreground">{item.courseCode}</div>
                  </TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.remarks}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert("Modification bientôt disponible")}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucune entrée trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
