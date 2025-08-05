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
import { MoreHorizontal, Edit, Trash2, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScheduleEntry } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faculty as allFaculty } from '@/lib/data';

function AddScheduleEntryForm({ onAddEntry }: { onAddEntry: (entry: ScheduleEntry) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [teacherId, setTeacherId] = React.useState('');
  const [courseName, setCourseName] = React.useState('');
  const [dayOfWeek, setDayOfWeek] = React.useState<ScheduleEntry['dayOfWeek']>('Lundi');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);
    if (!teacher || !courseName || !dayOfWeek || !startTime || !endTime || !location || !level || !semester) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newEntry: ScheduleEntry = {
      id: `SCH${Date.now()}`,
      teacherId,
      teacherName: teacher.name,
      courseName,
      courseCode: `C-${Date.now().toString().slice(-4)}`, // Placeholder
      dayOfWeek,
      startTime,
      endTime,
      location,
      level,
      semester,
    };
    onAddEntry(newEntry);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseName('');
    setDayOfWeek('Lundi');
    setStartTime('');
    setEndTime('');
    setLocation('');
    setLevel('');
    setSemester('');
  };
  
  const daysOfWeek: ScheduleEntry['dayOfWeek'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Planifier un cours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Planifier un nouveau cours</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant</Label>
              <Select onValueChange={setTeacherId} value={teacherId}>
                <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>{allFaculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Jour</Label>
              <Select onValueChange={(val: ScheduleEntry['dayOfWeek']) => setDayOfWeek(val)} value={dayOfWeek}>
                <SelectTrigger id="dayOfWeek"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>{daysOfWeek.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="courseName">Nom du cours</Label>
              <Input id="courseName" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Ex: Algorithmique" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Input id="level" value={level} onChange={e => setLevel(e.target.value)} placeholder="Ex: Licence 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input id="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="location">Salle / Lieu</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Amphi A" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input id="semester" value={semester} onChange={e => setSemester(e.target.value)} placeholder="Ex: S1" />
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


export function ScheduleTable({ data }: { data: ScheduleEntry[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [schedule, setSchedule] = React.useState(data);

  const currentFacultyIds = React.useMemo(() => allFaculty.map(f => f.id), []);
  const activeSchedule = React.useMemo(() => schedule.filter(entry => currentFacultyIds.includes(entry.teacherId)), [schedule, currentFacultyIds]);

  const filteredSchedule = activeSchedule.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddEntry = (newEntry: ScheduleEntry) => {
    setSchedule(prev => [...prev, newEntry].sort((a,b) => a.dayOfWeek.localeCompare(b.dayOfWeek) || a.startTime.localeCompare(b.startTime)));
  };

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm("Êtes-vous sûr de vouloir supprimer cette entrée de l'emploi du temps ?")) {
        setSchedule(schedule.filter(s => s.id !== id));
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emploi du temps</CardTitle>
            <CardDescription>Liste des cours planifiés.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <AddScheduleEntryForm onAddEntry={handleAddEntry} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedule.length > 0 ? filteredSchedule.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.dayOfWeek}</TableCell>
                  <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                  <TableCell>{entry.courseName}</TableCell>
                  <TableCell>{entry.teacherName}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>{entry.level}</TableCell>
                  <TableCell>{entry.semester}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(entry.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
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
