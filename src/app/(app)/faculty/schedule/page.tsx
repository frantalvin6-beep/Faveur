
'use client';

import * as React from 'react';
import { getSchedule, addScheduleEntry, getFaculty, getCourses, Faculty, Course, ScheduleEntry, deleteScheduleEntry } from '@/lib/data';
import { ScheduleGrid } from '@/components/faculty/schedule-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

interface GroupedSchedule {
  [key: string]: ScheduleEntry[];
}

function AddScheduleEntryForm({ onAddEntry }: { onAddEntry: (entry: Omit<ScheduleEntry, 'id'>) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [allFaculty, setAllFaculty] = React.useState<Faculty[]>([]);
  const [allCourses, setAllCourses] = React.useState<Course[]>([]);
  
  const [teacherId, setTeacherId] = React.useState('');
  const [courseCode, setCourseCode] = React.useState('');
  const [dayOfWeek, setDayOfWeek] = React.useState<ScheduleEntry['dayOfWeek']>('Lundi');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [location, setLocation] = React.useState('');
  
  const teacherCourses = allCourses.filter(c => c.teacherIds?.includes(teacherId));
  const selectedCourse = allCourses.find(c => c.code === courseCode);

  React.useEffect(() => {
    async function loadData() {
      const [facultyData, coursesData] = await Promise.all([getFaculty(), getCourses()]);
      setAllFaculty(facultyData);
      setAllCourses(coursesData);
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = allFaculty.find(f => f.id === teacherId);

    if (!teacher || !selectedCourse || !dayOfWeek || !startTime || !endTime || !location) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newEntry: Omit<ScheduleEntry, 'id'> = {
      teacherId,
      teacherName: teacher.name,
      courseName: selectedCourse.name,
      courseCode: selectedCourse.code,
      dayOfWeek,
      startTime,
      endTime,
      location,
      level: selectedCourse.level,
      semester: selectedCourse.semester,
    };
    onAddEntry(newEntry);
    setIsOpen(false);
    // Reset form
    setTeacherId('');
    setCourseCode('');
    setDayOfWeek('Lundi');
    setStartTime('');
    setEndTime('');
    setLocation('');
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
                <Label htmlFor="course">Matière</Label>
                <Select onValueChange={setCourseCode} value={courseCode} disabled={!teacherId}>
                    <SelectTrigger id="course"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>{teacherCourses.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.level})</SelectItem>)}</SelectContent>
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
              <Label htmlFor="location">Salle / Lieu</Label>
              <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Amphi A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="endTime">Heure de fin</Label>
              <Input id="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
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

export default function FacultySchedulePage() {
  const [schedule, setSchedule] = React.useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
      async function fetchData() {
          try {
              const scheduleData = await getSchedule();
              setSchedule(scheduleData);
          } catch (error) {
              console.error("Failed to fetch schedule:", error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger l\'emploi du temps.' });
          } finally {
              setLoading(false);
          }
      }
      fetchData();
  }, [toast]);

  const handleAddEntry = async (newEntryData: Omit<ScheduleEntry, 'id'>) => {
    try {
        const newEntry = await addScheduleEntry(newEntryData);
        setSchedule(prev => [...prev, newEntry]);
        toast({ title: 'Cours planifié', description: 'Le cours a été ajouté à l\'emploi du temps.' });
    } catch (error) {
        console.error("Failed to add schedule entry:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de planifier le cours.' });
    }
  };
  
   const handleDeleteEntry = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
          try {
              await deleteScheduleEntry(id);
              setSchedule(prev => prev.filter(s => s.id !== id));
              toast({ title: 'Entrée supprimée' });
          } catch (error) {
              console.error("Failed to delete entry:", error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'entrée.' });
          }
      }
  };


  const groupedSchedules = React.useMemo(() => {
    return schedule.reduce((acc, entry) => {
      const key = `${entry.level} - ${entry.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as GroupedSchedule);
  }, [schedule]);

  const filteredGroupKeys = Object.keys(groupedSchedules).filter(key => 
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedSchedules[key].some(entry => 
        entry.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort();
  
  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <div>
                      <Skeleton className="h-8 w-72" />
                      <Skeleton className="h-4 w-96 mt-2" />
                  </div>
                  <Skeleton className="h-10 w-72" />
              </div>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Emploi du temps par classe</h1>
            <p className="text-muted-foreground">
              Consultez les emplois du temps sous forme de grille hebdomadaire, groupés par niveau et semestre.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher (niveau, prof, matière...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddScheduleEntryForm onAddEntry={handleAddEntry} />
         </div>
       </div>
      
      {filteredGroupKeys.length > 0 ? (
        filteredGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleGrid schedule={groupedSchedules[groupName]} onDelete={handleDeleteEntry} />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucun emploi du temps ne correspond à votre recherche." : "Aucun emploi du temps à afficher."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
