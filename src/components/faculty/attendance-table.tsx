
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
import { PlusCircle, MoreHorizontal, Edit, Trash2, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeacherAttendance, ProgramStatus, Course, Faculty, CourseAssignment } from '@/lib/types';
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
import { getFaculty, getCourseAssignments, getCourses, addTeacherAttendance, deleteTeacherAttendance } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

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

function AddAttendanceForm({ onAddEntry }: { onAddEntry: (entry: Omit<TeacherAttendance, 'id'>) => Promise<TeacherAttendance> }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  const [allAssignments, setAllAssignments] = React.useState<CourseAssignment[]>([]);
  const [allCourses, setAllCourses] = React.useState<Course[]>([]);
  
  const [teacherId, setTeacherId] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [date, setDate] = React.useState('');
  const [status, setStatus] = React.useState<TeacherAttendance['status']>('Présent');
  const [remarks, setRemarks] = React.useState('');
  
  // Program Status
  const [selectedChapter, setSelectedChapter] = React.useState('');
  const [selectedLessons, setSelectedLessons] = React.useState<string[]>([]);
  const [isLessonsPopoverOpen, setIsLessonsPopoverOpen] = React.useState(false);
  
  const teacherCourses = allAssignments.filter(a => a.teacherId === teacherId);
  const courseDetails = allCourses.find(c => c.code === courseCode);
  const courseChapters = courseDetails?.chapters || [];

  React.useEffect(() => {
    async function loadData() {
      const [facultyData, assignmentsData, coursesData] = await Promise.all([getFaculty(), getCourseAssignments(), getCourses()]);
      setAllFaculty(facultyData);
      setAllAssignments(assignmentsData);
      setAllCourses(coursesData);
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleChapterChange = (chapterTitle: string) => {
    setSelectedChapter(chapterTitle);
    setSelectedLessons([]); // Reset lessons when chapter changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);
    const course = allAssignments.find(a => a.courseCode === courseCode && a.teacherId === teacherId);
    
    if (!teacher || !course || !date || !status) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    let programStatus: ProgramStatus | undefined = undefined;
    if (status === 'Présent' && selectedChapter) {
        if (selectedLessons.length === 0) {
            alert("Veuillez sélectionner au moins une leçon pour le chapitre enseigné.");
            return;
        }
        programStatus = { chapter: selectedChapter, lessons: selectedLessons };
    }

    const newEntry: Omit<TeacherAttendance, 'id'> = {
      teacherId,
      teacherName: teacher.name,
      courseName: course.courseName,
      courseCode: course.courseCode,
      date,
      status,
      remarks,
      programStatus,
    };

    await onAddEntry(newEntry);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseCode('');
    setDate('');
    setStatus('Présent');
    setRemarks('');
    setSelectedChapter('');
    setSelectedLessons([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Marquer une présence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Marquer une présence</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>{allFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Cours</Label>
              <Select onValueChange={(code) => { setCourseCode(code); setSelectedChapter(''); setSelectedLessons([]); }} value={courseCode} disabled={!teacherId}>
                <SelectTrigger id="course"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {teacherCourses.map(c => <SelectItem key={c.courseCode} value={c.courseCode}>{c.courseName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            {status === 'Présent' && courseDetails && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Suivi du programme</CardTitle>
                  <CardDescription className="text-xs">Qu'est-ce qui a été enseigné pendant ce cours ?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Chapitre</Label>
                        <Select onValueChange={handleChapterChange} value={selectedChapter}>
                            <SelectTrigger><SelectValue placeholder="Sélectionner un chapitre..." /></SelectTrigger>
                            <SelectContent>
                                {courseChapters.map(c => <SelectItem key={c.title} value={c.title}>{c.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Leçons</Label>
                        <Popover open={isLessonsPopoverOpen} onOpenChange={setIsLessonsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start font-normal" disabled={!selectedChapter}>
                                    {selectedLessons.length > 0 ? selectedLessons.join(', ') : "Sélectionner les leçons..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Rechercher..." />
                                    <CommandList>
                                        <CommandEmpty>Aucune leçon trouvée.</CommandEmpty>
                                        <CommandGroup>
                                            {courseChapters.find(c => c.title === selectedChapter)?.subChapters?.map(lesson => (
                                                <CommandItem key={lesson.title} onSelect={() => {
                                                    const newSelection = selectedLessons.includes(lesson.title)
                                                        ? selectedLessons.filter(l => l !== lesson.title)
                                                        : [...selectedLessons, lesson.title];
                                                    setSelectedLessons(newSelection);
                                                }}>
                                                    <Check className={cn("mr-2 h-4 w-4", selectedLessons.includes(lesson.title) ? "opacity-100" : "opacity-0")} />
                                                    {lesson.title}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarques</Label>
              <Textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder={status === 'Justifié' ? "Motif de l'absence..." : 'Optionnel'} />
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
          <Button type="submit" onClick={handleSubmit}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function AttendanceTable({ initialData }: { initialData: TeacherAttendance[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [attendance, setAttendance] = React.useState(initialData);
  const { toast } = useToast();

  const handleAddEntry = async (newEntryData: Omit<TeacherAttendance, 'id'>) => {
    try {
        const newEntry = await addTeacherAttendance(newEntryData);
        setAttendance(prev => [newEntry, ...prev]);
        toast({ title: 'Présence enregistrée' });
        return newEntry;
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'enregistrer la présence.' });
        throw error;
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      try {
          await deleteTeacherAttendance(id);
          setAttendance(prev => prev.filter(a => a.id !== id));
          toast({ title: 'Entrée supprimée' });
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'entrée.' });
      }
    }
  };

  const filteredAttendance = attendance.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <TableHead>Programme Effectué</TableHead>
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
                  <TableCell>
                      {item.programStatus ? (
                          <div className='max-w-xs'>
                            <p className="font-semibold text-xs truncate">{item.programStatus.chapter}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {item.programStatus.lessons.map(lesson => <Badge key={lesson} variant="secondary" className="font-normal">{lesson}</Badge>)}
                            </div>
                          </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleDeleteEntry(item.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
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
