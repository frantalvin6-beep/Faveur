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
import { Badge } from '@/components/ui/badge';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);
    if (!teacher || !courseName || !dayOfWeek || !startTime || !endTime || !location || !level) {
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
  };
  
  const daysOfWeek: ScheduleEntry['dayOfWeek'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un cours
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
             <div className="space-y-2 col-span-full">
              <Label htmlFor="location">Salle / Lieu</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Amphi A" />
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

  const daysOfWeek: ScheduleEntry['dayOfWeek'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
  
  const currentFacultyIds = React.useMemo(() => allFaculty.map(f => f.id), []);
  const activeSchedule = React.useMemo(() => schedule.filter(entry => currentFacultyIds.includes(entry.teacherId)), [schedule, currentFacultyIds]);


  const filteredSchedule = activeSchedule.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEntry = (day: string, time: string) => {
    return filteredSchedule.find(
      (entry) =>
        entry.dayOfWeek === day &&
        entry.startTime.split(':')[0] === time.split(':')[0]
    );
  };
  
  const handleAddEntry = (newEntry: ScheduleEntry) => {
    setSchedule(prev => [...prev, newEntry]);
  };

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette entrée de l\'emploi du temps ?')) {
        setSchedule(schedule.filter(s => s.id !== id));
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emploi du temps de la semaine</CardTitle>
            <CardDescription>Vue hebdomadaire des cours planifiés.</CardDescription>
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
        <div className="relative w-full overflow-auto rounded-md border">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Heure</TableHead>
                {daysOfWeek.map((day) => (
                  <TableHead key={day} className="w-[200px] text-center">{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((time) => (
                <TableRow key={time}>
                  <TableCell className="font-medium text-center">{time}</TableCell>
                  {daysOfWeek.map((day) => {
                    const entry = getEntry(day, time);
                    return (
                      <TableCell key={`${day}-${time}`} className="p-1 align-top h-24">
                        {entry && (
                          <div className="group relative h-full rounded-lg bg-muted p-2 text-left">
                            <p className="font-semibold text-primary">{entry.courseName}</p>
                            <p className="text-sm text-muted-foreground">{entry.teacherName}</p>
                            <p className="text-xs text-muted-foreground">{entry.startTime} - {entry.endTime}</p>
                            <Badge variant="secondary" className="mt-1">{entry.location}</Badge>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
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
                            </div>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
