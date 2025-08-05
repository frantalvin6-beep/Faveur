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
import { ExamSchedule } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ExamsPlanningTable({ data }: { data: ExamSchedule[] }) {
  const [schedule, setSchedule] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredSchedule = schedule.filter((item) =>
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => alert("La fonctionnalité d'ajout sera bientôt implémentée.");
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette planification d\'examen ?')) {
        setSchedule(schedule.filter(s => s.id !== id));
    }
  };

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
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Planifier un examen
                </Button>
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
                            onClick={() => handleDelete(item.id)}
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
