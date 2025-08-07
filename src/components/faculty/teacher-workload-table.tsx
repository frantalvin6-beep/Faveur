
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
import { TeacherWorkload, CourseAssignment, Faculty } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
import { getFaculty, getCourseAssignments } from '@/lib/data';

function AddWorkloadForm({ onAddEntry }: { onAddEntry: (entry: Omit<TeacherWorkload, 'id'>) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  const [allAssignments, setAllAssignments] = React.useState<CourseAssignment[]>([]);

  const [teacherId, setTeacherId] = React.useState('');
  const [assignmentId, setAssignmentId] = React.useState('');
  const [plannedHours, setPlannedHours] = React.useState(0);

  const teacherAssignments = allAssignments.filter(a => a.teacherId === teacherId);

  React.useEffect(() => {
    async function loadData() {
        const [facultyData, assignmentsData] = await Promise.all([getFaculty(), getCourseAssignments()]);
        setAllFaculty(facultyData);
        setAllAssignments(assignmentsData);
    }
    if (isOpen) {
        loadData();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    if (!assignment || plannedHours <= 0) {
      alert("Veuillez sélectionner un enseignant, un cours valide, et entrer un nombre d'heures planifiées supérieur à 0.");
      return;
    }

    const newEntry: Omit<TeacherWorkload, 'id'> = {
      teacherId: assignment.teacherId,
      teacherName: assignment.teacherName,
      courseName: assignment.courseName,
      level: assignment.level,
      semester: assignment.semester,
      plannedHours: plannedHours,
      completedHours: 0,
    };

    onAddEntry(newEntry);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setAssignmentId('');
    setPlannedHours(0);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une charge horaire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner un enseignant..." /></SelectTrigger>
                <SelectContent>{allFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="assignment">Cours attribué</Label>
              <Select onValueChange={setAssignmentId} value={assignmentId} disabled={!teacherId}>
                <SelectTrigger id="assignment"><SelectValue placeholder="Sélectionner un cours..." /></SelectTrigger>
                <SelectContent>
                  {teacherAssignments.map(a => <SelectItem key={a.id} value={a.id}>{a.courseName} ({a.level})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="planned-hours">Heures Planifiées</Label>
                <Input 
                    id="planned-hours"
                    type="number"
                    value={plannedHours}
                    onChange={(e) => setPlannedHours(Number(e.target.value))}
                    placeholder="ex: 40"
                    required
                />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Ajouter l'entrée</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function TeacherWorkloadTable({ data, onAddWorkload, onDeleteWorkload }: { data: TeacherWorkload[], onAddWorkload: (workload: Omit<TeacherWorkload, 'id'>) => void, onDeleteWorkload: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredWorkload = data.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Suivi des charges horaires</CardTitle>
                <CardDescription>Consultez la progression des heures de cours.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <AddWorkloadForm onAddEntry={onAddWorkload} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Heures prévues</TableHead>
                    <TableHead>Heures effectuées</TableHead>
                    <TableHead className="w-[200px]">% Réalisé</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredWorkload.length > 0 ? filteredWorkload.map((item) => {
                    const percentage = item.plannedHours > 0 ? (item.completedHours / item.plannedHours) * 100 : 0;
                    return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.teacherName}</TableCell>
                            <TableCell>{item.courseName}</TableCell>
                            <TableCell>{item.level}</TableCell>
                            <TableCell>{item.semester}</TableCell>
                            <TableCell>{item.plannedHours}h</TableCell>
                            <TableCell>{item.completedHours}h</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="w-full" />
                                    <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
                                </div>
                            </TableCell>
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
                                    onClick={() => onDeleteWorkload(item.id)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                }) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            Aucune donnée de charge horaire trouvée.
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
