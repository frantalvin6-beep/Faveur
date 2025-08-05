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
import { CourseAssignment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CourseAssignmentsTable({ data }: { data: CourseAssignment[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [assignments, setAssignments] = React.useState(data);

  const filteredAssignments = assignments.filter((item) =>
    item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => alert('La fonctionnalité d\'ajout d\'une nouvelle attribution sera bientôt implémentée.');
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification de l'attribution ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette attribution ?')) {
        setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Attributions des Cours</CardTitle>
                <CardDescription>Gérer l'attribution des cours aux membres du personnel enseignant.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher une attribution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une attribution
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="whitespace-nowrap">Enseignant</TableHead>
                <TableHead className="whitespace-nowrap">Cours Attribué</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="whitespace-nowrap">Volume Horaire</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredAssignments.length > 0 ? filteredAssignments.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">
                        <div>{item.teacherName}</div>
                        <div className="text-xs text-muted-foreground">{item.teacherId}</div>
                    </TableCell>
                    <TableCell>
                        <div>{item.courseName}</div>
                        <div className="text-xs text-muted-foreground">{item.courseCode}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{item.department}</Badge></TableCell>
                    <TableCell>{item.level}</TableCell>
                    <TableCell>{item.semester}</TableCell>
                    <TableCell>{item.hourlyVolume}h</TableCell>
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
                        <TableCell colSpan={7} className="h-24 text-center">
                            Aucun résultat trouvé.
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
