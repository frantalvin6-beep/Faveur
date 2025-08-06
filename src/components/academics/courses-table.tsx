
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
import { PlusCircle, MoreHorizontal, Edit, Trash2, User, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Course, Faculty } from '@/lib/types';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments, faculty } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';


export function AddCourseForm({ onAddCourse }: { onAddCourse: (course: Course) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [credits, setCredits] = React.useState(0);
  const [lessons, setLessons] = React.useState('');
  const [teacherIds, setTeacherIds] = React.useState<string[]>([]);
  const [openTeacherPopover, setOpenTeacherPopover] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !department || !level || !semester || credits <= 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newCourse: Course = {
      code,
      name,
      department,
      level,
      semester,
      credits,
      lessons: lessons.split('\n').filter(l => l.trim() !== ''),
      teacherIds: teacherIds,
    };
    onAddCourse(newCourse);
    setIsOpen(false);
    // Reset form
    setCode('');
    setName('');
    setDepartment('');
    setLevel('');
    setSemester('');
    setCredits(0);
    setLessons('');
    setTeacherIds([]);
  };

  const selectedTeachers = faculty.filter(f => teacherIds.includes(f.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une matière
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Matière</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code Matière</Label>
              <Input id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="Ex: MATH101" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la matière</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Algèbre Linéaire" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département/Option</Label>
               <Select onValueChange={setDepartment} value={department} required>
                <SelectTrigger id="department"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {departments.filter(d => d.id.includes('OPT')).map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Select onValueChange={setLevel} value={level} required>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le niveau..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Licence 1">Licence 1</SelectItem>
                        <SelectItem value="Licence 2">Licence 2</SelectItem>
                        <SelectItem value="Licence 3">Licence 3</SelectItem>
                        <SelectItem value="Master 1">Master 1</SelectItem>
                        <SelectItem value="Master 2">Master 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input id="semester" value={semester} onChange={e => setSemester(e.target.value)} placeholder="Ex: Semestre 1" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="credits">Crédits (Coefficient)</Label>
              <Input id="credits" type="number" min="0" value={credits} onChange={e => setCredits(Number(e.target.value))} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="teachers">Enseignant(s)</Label>
                <Popover open={openTeacherPopover} onOpenChange={setOpenTeacherPopover}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                            <User className="mr-2 h-4 w-4" />
                            {selectedTeachers.length > 0 ? selectedTeachers.map(t => t.name).join(', ') : "Sélectionner un ou plusieurs enseignants"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Rechercher..." />
                            <CommandList>
                                <CommandEmpty>Aucun enseignant trouvé.</CommandEmpty>
                                <CommandGroup>
                                {faculty.map((teacher) => (
                                    <CommandItem
                                        key={teacher.id}
                                        onSelect={() => {
                                            const newIds = teacherIds.includes(teacher.id)
                                                ? teacherIds.filter((id) => id !== teacher.id)
                                                : [...teacherIds, teacher.id];
                                            setTeacherIds(newIds);
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", teacherIds.includes(teacher.id) ? "opacity-100" : "opacity-0")} />
                                        <span>{teacher.name}</span>
                                    </CommandItem>
                                ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="lessons">Leçons (une par ligne)</Label>
                <Textarea id="lessons" value={lessons} onChange={e => setLessons(e.target.value)} placeholder="Chapitre 1: Introduction&#10;Chapitre 2: Concepts clés" />
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


export function CoursesTable({ data, onDeleteCourse }: { data: Course[], onDeleteCourse: (code: string) => void }) {
  const handleEdit = (code: string) => alert(`Modification de ${code} bientôt disponible.`);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom de la matière & Leçons</TableHead>
            <TableHead>Enseignants</TableHead>
            <TableHead>Semestre</TableHead>
            <TableHead>Crédits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((item) => (
            <TableRow key={item.code}>
              <TableCell className="font-mono align-top">{item.code}</TableCell>
              <TableCell className="font-medium align-top">
                {item.name}
                {item.lessons && item.lessons.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                    {item.lessons.map(lesson => <li key={lesson}>{lesson}</li>)}
                  </ul>
                )}
              </TableCell>
               <TableCell className="align-top">
                {item.teacherIds && item.teacherIds.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {item.teacherIds.map(id => {
                            const teacher = faculty.find(f => f.id === id);
                            return teacher ? <Badge key={id} variant="outline" className="font-normal">{teacher.name}</Badge> : null;
                        })}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell className="align-top">{item.semester}</TableCell>
              <TableCell className="align-top">{item.credits}</TableCell>
              <TableCell className="text-right align-top">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(item.code)}>
                      <Edit className="mr-2 h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteCourse(item.code)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucune matière trouvée pour ce groupe.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
