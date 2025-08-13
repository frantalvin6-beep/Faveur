
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
import { ExamSchedule, Course, Faculty } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getCourses, getFaculty } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

function AddExamForm({ onAdd }: { onAdd: (exam: Omit<ExamSchedule, 'id'>) => Promise<void> }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [faculty, setFaculty] = React.useState<Faculty[]>([]);
    const { toast } = useToast();

    // Form state
    const [courseCode, setCourseCode] = React.useState('');
    const [supervisorId, setSupervisorId] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [room, setRoom] = React.useState('');
    const [examType, setExamType] = React.useState<ExamSchedule['examType']>('Contrôle');
    
    React.useEffect(() => {
        if(isOpen) {
            async function fetchData() {
                try {
                    const [coursesData, facultyData] = await Promise.all([getCourses(), getFaculty()]);
                    setCourses(coursesData);
                    setFaculty(facultyData);
                } catch(error) {
                    toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données pour le formulaire.'});
                }
            }
            fetchData();
        }
    }, [isOpen, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const course = courses.find(c => c.code === courseCode);
        const supervisor = faculty.find(f => f.id === supervisorId);

        if (!course || !supervisor || !date || !time || !room) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires.'});
            return;
        }

        const newExam: Omit<ExamSchedule, 'id'> = {
            date,
            time,
            courseName: course.name,
            supervisor: supervisor.name,
            room,
            level: course.level,
            examType
        };

        try {
            await onAdd(newExam);
            setIsOpen(false);
            // Reset form
            setCourseCode('');
            setSupervisorId('');
            setDate('');
            setTime('');
            setRoom('');
            setExamType('Contrôle');
        } catch(error) {
            // Error is handled by parent component
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Planifier un examen
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Planifier un nouvel examen</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-6 -mr-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="course">Matière</Label>
                                <Select onValueChange={setCourseCode} value={courseCode}>
                                    <SelectTrigger id="course"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                    <SelectContent>
                                        {courses.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.level})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="supervisor">Surveillant</Label>
                                <Select onValueChange={setSupervisorId} value={supervisorId}>
                                    <SelectTrigger id="supervisor"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                    <SelectContent>
                                        {faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Heure</Label>
                                <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room">Salle</Label>
                                <Input id="room" value={room} onChange={e => setRoom(e.target.value)} placeholder="Ex: Amphi A, Salle 101" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="examType">Type d'examen</Label>
                                <Select onValueChange={(v: ExamSchedule['examType']) => setExamType(v)} value={examType}>
                                    <SelectTrigger id="examType"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Contrôle">Contrôle</SelectItem>
                                        <SelectItem value="Partiel">Partiel</SelectItem>
                                        <SelectItem value="Final">Final</SelectItem>
                                        <SelectItem value="Rattrapage">Rattrapage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </ScrollArea>
                </form>
                 <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                    <Button type="submit" form="add-exam-form" onClick={handleSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export function ExamsPlanningTable({ data, onAdd, onDelete }: { data: ExamSchedule[], onAdd: (exam: Omit<ExamSchedule, 'id'>) => Promise<void>, onDelete: (id: string) => Promise<void> }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSchedule = data.filter((item) =>
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Calendrier des examens</CardTitle>
                <CardDescription>Planifiez et consultez les sessions d'examen.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <AddExamForm onAdd={onAdd} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Surveillant</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredSchedule.length > 0 ? filteredSchedule.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.courseName}</TableCell>
                    <TableCell>{item.supervisor}</TableCell>
                    <TableCell>{item.room}</TableCell>
                    <TableCell>{item.level}</TableCell>
                    <TableCell><Badge variant="outline">{item.examType}</Badge></TableCell>
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
                            onClick={() => onDelete(item.id)}
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
                        <TableCell colSpan={8} className="h-24 text-center">
                            Aucun examen planifié trouvé.
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
