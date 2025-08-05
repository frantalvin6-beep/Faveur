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
import { ExamGrade } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function getGradeColor(grade: number) {
  if (grade >= 15) return 'text-green-600';
  if (grade >= 10) return 'text-blue-600';
  if (grade >= 7) return 'text-orange-600';
  return 'text-red-600';
}

export function GradesTable({ data }: { data: ExamGrade[] }) {
  const [grades, setGrades] = React.useState(data);

  React.useEffect(() => {
    setGrades(data);
  }, [data]);

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  const handleDelete = (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        setGrades(grades.filter(g => g.id !== id));
    }
  };

  if (data.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-8">
            Aucune note disponible pour cette option.
        </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="whitespace-nowrap">Étudiant</TableHead>
            <TableHead className="whitespace-nowrap">Matière</TableHead>
            <TableHead className="whitespace-nowrap">Enseignant</TableHead>
            <TableHead className="whitespace-nowrap">Type d'examen</TableHead>
            <TableHead className="text-center whitespace-nowrap">Note</TableHead>
            <TableHead className="text-center whitespace-nowrap">Coeff.</TableHead>
            <TableHead className="text-center whitespace-nowrap">Note pondérée</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {grades.map((item) => (
            <TableRow key={item.id}>
                <TableCell className="font-medium">
                    <div>{item.studentName}</div>
                    <div className="text-xs text-muted-foreground">{item.studentId}</div>
                </TableCell>
                <TableCell>
                    <div>{item.courseName}</div>
                    <div className="text-xs text-muted-foreground">{item.courseCode}</div>
                </TableCell>
                <TableCell>{item.teacherName}</TableCell>
                <TableCell><Badge variant="secondary">{item.examType}</Badge></TableCell>
                <TableCell className={`text-center font-bold text-lg ${getGradeColor(item.grade)}`}>{item.grade.toFixed(2)}</TableCell>

                <TableCell className="text-center">{item.coefficient}</TableCell>
                <TableCell className="text-center font-medium">{ (item.grade * item.coefficient).toFixed(2) }</TableCell>
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
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
