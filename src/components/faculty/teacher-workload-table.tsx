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
import { TeacherWorkload } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function TeacherWorkloadTable({ data }: { data: TeacherWorkload[] }) {
  const [workload, setWorkload] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredWorkload = workload.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => alert("La fonctionnalité d'ajout sera bientôt implémentée.");
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
        setWorkload(workload.filter(w => w.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Suivi des charges horaires</CardTitle>
                <CardDescription>Consultez la progression des heures de cours.</CardDescription>
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
                    Ajouter
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Heures prévues</TableHead>
                    <TableHead>Heures effectuées</TableHead>
                    <TableHead className="w-[200px]">% Réalisé</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredWorkload.length > 0 ? filteredWorkload.map((item) => {
                    const percentage = item.plannedHours > 0 ? (item.completedHours / item.plannedHours) * 100 : 0;
                    return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.teacherName}</TableCell>
                            <TableCell>{item.courseName}</TableCell>
                            <TableCell>{item.level}</TableCell>
                            <TableCell>{item.semester}</TableCell>
                            <TableCell>{item.plannedHours}h</TableCell>
                            <TableCell>{item.completedHours}h</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="w-full" />
                                    <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
                                </div>
                            </TableCell>
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
                    )
                }) : (
                    <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                            Aucune donnée de charge horaire trouvée.
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
