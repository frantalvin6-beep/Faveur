
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
import { PlusCircle, MoreHorizontal, Edit, Trash2, User, BookOpen, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Course, Faculty, Chapter, Department } from '@/lib/types';
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
import { getFaculty } from '@/lib/data';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface ChapterInput {
  id: string;
  title: string;
  subChapters: string;
  estimatedDuration: string;
}

export function AddCourseForm({ onAddCourse, allDepartments }: { onAddCourse: (course: Omit<Course, 'code'>) => Promise<void>, allDepartments: Department[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  
  // Form State
  const [name, setName] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [credits, setCredits] = React.useState(0);
  const [chapters, setChapters] = React.useState<ChapterInput[]>([{ id: `ch${Date.now()}`, title: '', subChapters: '', estimatedDuration: '' }]);
  const [teacherIds, setTeacherIds] = React.useState<string[]>([]);

  // Popover state
  const [openTeacherPopover, setOpenTeacherPopover] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
        async function fetchFaculty() {
            try {
                const facultyData = await getFaculty();
                setAllFaculty(facultyData);
            } catch (error) {
                console.error("Failed to fetch faculty:", error);
            }
        }
        fetchFaculty();
    }
  }, [isOpen]);
  
  const resetForm = () => {
    setName('');
    setDepartment('');
    setLevel('');
    setSemester('');
    setCredits(0);
    setChapters([{ id: `ch${Date.now()}`, title: '', subChapters: '', estimatedDuration: '' }]);
    setTeacherIds([]);
    setOpenTeacherPopover(false);
  };

  const handleAddChapter = () => {
    setChapters(prev => [...prev, { id: `ch${Date.now()}`, title: '', subChapters: '', estimatedDuration: '' }]);
  };

  const handleRemoveChapter = (id: string) => {
    setChapters(prev => prev.filter(c => c.id !== id));
  };
  
  const handleChapterChange = (id: string, field: 'title' | 'subChapters' | 'estimatedDuration', value: string) => {
      setChapters(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !department || !level || !semester || credits <= 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const finalChapters: Chapter[] = chapters
      .filter(c => c.title.trim() !== '')
      .map((c, index) => ({
        id: `CH-${name.substring(0,3).toUpperCase()}-${index + 1}`,
        title: c.title,
        estimatedDuration: c.estimatedDuration,
        subChapters: c.subChapters.split('\n').filter(sc => sc.trim() !== '').map(sc => ({ title: sc }))
      }));

    const newCourse: Omit<Course, 'code'> = {
      name,
      department,
      level,
      semester,
      credits,
      chapters: finalChapters,
      teacherIds: teacherIds,
    };
    
    try {
        await onAddCourse(newCourse);
        setIsOpen(false);
        resetForm();
    } catch (error) {
        // Error toast is shown in the parent component
    }
  };

  const selectedTeachers = allFaculty.filter(f => teacherIds.includes(f.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une matière
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nouvelle Matière</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="add-course-form" className="flex-grow overflow-hidden flex flex-col gap-4">
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nom de la matière</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Algèbre Linéaire" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département/Option</Label>
                <Select onValueChange={setDepartment} value={department} required>
                  <SelectTrigger id="department"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {allDepartments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
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
              <div className="space-y-2 md:col-span-2">
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
                                  {allFaculty.map((teacher) => (
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
            </div>
            
            <div className="mt-4 px-1">
                 <Label className="text-base font-medium mb-2 block">Chapitres et Leçons</Label>
                    <div className="space-y-4">
                        {chapters.map((chapter, index) => (
                            <div key={chapter.id} className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 p-3 border rounded-md relative bg-muted/30">
                              <div className="space-y-2">
                                  <Label htmlFor={`chapter-title-${index}`}>Titre du chapitre {index + 1}</Label>
                                  <Input 
                                      id={`chapter-title-${index}`} 
                                      value={chapter.title} 
                                      onChange={e => handleChapterChange(chapter.id, 'title', e.target.value)}
                                      placeholder="Ex: Introduction aux Concepts"
                                  />
                              </div>
                               <div className="space-y-2">
                                  <Label htmlFor={`duration-${index}`}>Durée estimée</Label>
                                  <Input 
                                      id={`duration-${index}`} 
                                      value={chapter.estimatedDuration} 
                                      onChange={e => handleChapterChange(chapter.id, 'estimatedDuration', e.target.value)}
                                      placeholder="Ex: 2h"
                                  />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                  <Label htmlFor={`subchapters-${index}`}>Sous-chapitres (un par ligne)</Label>
                                  <Textarea 
                                      id={`subchapters-${index}`} 
                                      value={chapter.subChapters} 
                                      onChange={e => handleChapterChange(chapter.id, 'subChapters', e.target.value)}
                                      placeholder="Leçon 1.1\nLeçon 1.2"
                                      rows={3}
                                  />
                              </div>
                                {chapters.length > 1 && (
                                  <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveChapter(chapter.id)}>
                                      <X className="h-4 w-4" />
                                  </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddChapter} className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un chapitre
                    </Button>
            </div>
          </ScrollArea>
        </form>
        <DialogFooter className="pt-4 flex-shrink-0">
            <DialogClose asChild><Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button></DialogClose>
            <Button type="submit" form="add-course-form">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function CoursesTable({ data, onDeleteCourse, onUpdateCourse }: { data: Course[], onDeleteCourse: (code: string) => void, onUpdateCourse: (code: string, data: Partial<Course>) => void }) {
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);

  React.useEffect(() => {
    async function fetchFaculty() {
        const facultyData = await getFaculty();
        setAllFaculty(facultyData);
    }
    fetchFaculty();
  }, []);

  const handleEdit = (code: string) => {
    // For simplicity, we'll prompt for the new name. 
    // A real app would use a dialog/form.
    const newName = prompt(`Entrez le nouveau nom pour la matière ${code}:`);
    if (newName) {
      onUpdateCourse(code, { name: newName });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom de la matière</TableHead>
            <TableHead>Chapitres</TableHead>
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
              <TableCell className="font-medium align-top">{item.name}</TableCell>
               <TableCell className="align-top">
                {item.chapters && item.chapters.length > 0 ? (
                  <ul className="space-y-1">
                    {item.chapters.map((chapter, index) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        {chapter.title}
                      </li>
                     ))}
                  </ul>
                ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
               <TableCell className="align-top">
                {item.teacherIds && item.teacherIds.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {item.teacherIds.map(id => {
                            const teacher = allFaculty.find(f => f.id === id);
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
              <TableCell colSpan={7} className="h-24 text-center">
                Aucune matière trouvée pour ce groupe.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
