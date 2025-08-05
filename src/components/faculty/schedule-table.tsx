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

export function ScheduleTable({ data }: { data: ScheduleEntry[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [schedule, setSchedule] = React.useState(data);

  const daysOfWeek: ScheduleEntry['dayOfWeek'][] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  const filteredSchedule = schedule.filter((item) =>
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
  
  const handleAdd = () => alert("La fonctionnalité d'ajout sera bientôt implémentée.");
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
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un cours
            </Button>
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
