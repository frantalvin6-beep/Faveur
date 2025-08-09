
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CourseAssignment, Faculty, Course } from '@/lib/types';
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

function AddAssignmentForm({ onAddAssignment, courses, faculty }: { onAddAssignment: (assignment: Omit<CourseAssignment, 'id'>) => void, courses: Course[], faculty: Faculty[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const [teacherId, setTeacherId] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = faculty.find(f => f.id === teacherId);
    const course = courses.find(c => c.code === courseCode);
    
    if (!teacher || !course) {
      alert("Veuillez sélectionner un enseignant et un cours valides.");
      return;
    }

    const newAssignment: Omit<CourseAssignment, 'id'> = {
      teacherId,
      teacherName: teacher.name,
      courseName: course.name,
      courseCode: course.code,
      department: course.department,
      level: course.level,
      semester: course.semester,
      hourlyVolume: course.credits * 10, // Example calculation
    };
    onAddAssignment(newAssignment);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une attribution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle Attribution de Cours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Sélectionnez un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Cours</Label>
               <Select onValueChange={setCourseCode} value={courseCode}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Sélectionnez un cours" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.level})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function CourseAssignmentsTable({ data, courses, faculty, onAddAssignment, onDeleteAssignment }: { data: CourseAssignment[], courses: Course[], faculty: Faculty[], onAddAssignment: (assignment: Omit<CourseAssignment, 'id'>) => void, onDeleteAssignment: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAssignments = data.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification de l'attribution ${id} sera bientôt implémentée.`);
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Attributions des Cours</CardTitle>
                <CardDescription>Gérer l'attribution des cours aux membres du personnel enseignant.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher une attribution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <AddAssignmentForm onAddAssignment={onAddAssignment} courses={courses} faculty={faculty} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="relative w-full overflow-auto rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="whitespace-nowrap">Enseignant</TableHead>
                <TableHead className="whitespace-nowrap">Cours Attribué</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="whitespace-nowrap">Volume Horaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAssignments.length > 0 ? filteredAssignments.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">
                        <div>{item.teacherName}</div>
                        <div className="text-xs text-muted-foreground">{item.teacherId}</div>
                    </TableCell>
                    <TableCell>
                        <div>{item.courseName}</div>
                        <div className="text-xs text-muted-foreground">{item.courseCode}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{item.department}</Badge></TableCell>
                    <TableCell>{item.level}</TableCell>
                    <TableCell>{item.semester}</TableCell>
                    <TableCell>{item.hourlyVolume}h</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(item.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDeleteAssignment(item.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            Aucun résultat trouvé.
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
