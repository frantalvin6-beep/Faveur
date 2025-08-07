
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
import { CourseAssignment, Faculty, Department } from '@/lib/types';
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
import { getFaculty, getDepartments } from '@/lib/data';

function AddAssignmentForm({ onAddAssignment }: { onAddAssignment: (assignment: Omit<CourseAssignment, 'id'>) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  const [allDepartments, setAllDepartments] = React.useState<Department[]>([]);
  
  const [teacherId, setTeacherId] = React.useState('');
  const [courseName, setCourseName] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [hourlyVolume, setHourlyVolume] = React.useState(0);

  React.useEffect(() => {
    async function loadData() {
      const [facultyData, deptData] = await Promise.all([getFaculty(), getDepartments()]);
      setAllFaculty(facultyData);
      setAllDepartments(deptData.filter(d => !d.id.includes('OPT')));
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);
    if (!teacher || !courseName || !courseCode || !department || !level || !semester || hourlyVolume <= 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newAssignment: Omit<CourseAssignment, 'id'> = {
      teacherId,
      teacherName: teacher.name,
      courseName,
      courseCode,
      department,
      level,
      semester,
      hourlyVolume,
    };
    onAddAssignment(newAssignment);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseName('');
    setCourseCode('');
    setDepartment('');
    setLevel('');
    setSemester('');
    setHourlyVolume(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une attribution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Attribution de Cours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Sélectionnez un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {allFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
               <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  {allDepartments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Nom du cours</Label>
              <Input id="courseName" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Ex: Algorithmique Avancée" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode">Code du cours</Label>
              <Input id="courseCode" value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="Ex: CS301" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Input id="level" value={level} onChange={e => setLevel(e.target.value)} placeholder="Ex: Licence 3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input id="semester" value={semester} onChange={e => setSemester(e.target.value)} placeholder="Ex: Semestre 1" />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="hourlyVolume">Volume Horaire (heures)</Label>
              <Input id="hourlyVolume" type="number" value={hourlyVolume} onChange={e => setHourlyVolume(parseInt(e.target.value))} />
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


export function CourseAssignmentsTable({ data, onAddAssignment, onDeleteAssignment }: { data: CourseAssignment[], onAddAssignment: (assignment: Omit<CourseAssignment, 'id'>) => void, onDeleteAssignment: (id: string) => void }) {
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
                <AddAssignmentForm onAddAssignment={onAddAssignment} />
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
