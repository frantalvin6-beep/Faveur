
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
import { MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExamGrade } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function getGradeColor(grade: number) {
  if (grade >= 15) return 'text-green-600';
  if (grade >= 10) return 'text-blue-600';
  if (grade >= 7) return 'text-orange-600';
  return 'text-red-600';
}

export function GradesTable({ data, onGradeUpdate, onGradeDelete }: { data: ExamGrade[], onGradeUpdate: (grade: ExamGrade) => void, onGradeDelete: (id: string) => void }) {
  const [grades, setGrades] = React.useState(data);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [currentGrade, setCurrentGrade] = React.useState<number>(0);

  React.useEffect(() => {
    setGrades(data);
  }, [data]);
  
  const handleEditClick = (grade: ExamGrade) => {
    setEditingId(grade.id);
    setCurrentGrade(grade.grade);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  }
  
  const handleSaveEdit = (grade: ExamGrade) => {
     onGradeUpdate({ ...grade, grade: currentGrade });
     setEditingId(null);
  }

  if (data.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-8">
            Aucune note saisie pour cette session. Cliquez sur "Saisir une note" pour commencer.
        </div>
    )
  }

  return (
    <div className="relative w-full overflow-auto rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="whitespace-nowrap">Matricule</TableHead>
            <TableHead className="whitespace-nowrap">Nom de l'étudiant</TableHead>
            <TableHead className="text-center whitespace-nowrap">Note / 20</TableHead>
            <TableHead className="text-center whitespace-nowrap">Coeff.</TableHead>
            <TableHead className="text-center whitespace-nowrap">Note pondérée</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {grades.map((item) => (
            <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.studentId}</TableCell>
                <TableCell className="font-medium">{item.studentName}</TableCell>
                
                <TableCell className="text-center">
                    {editingId === item.id ? (
                        <Input 
                            type="number"
                            value={currentGrade}
                            onChange={(e) => setCurrentGrade(Number(e.target.value))}
                            className="w-24 mx-auto h-8"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item)}
                        />
                    ) : (
                        <span className={`font-bold text-lg ${getGradeColor(item.grade)}`}>
                            {item.grade.toFixed(2)}
                        </span>
                    )}
                </TableCell>
                
                <TableCell className="text-center">{item.coefficient}</TableCell>
                <TableCell className="text-center font-medium">{ (item.grade * item.coefficient).toFixed(2) }</TableCell>
                
                <TableCell className="text-right">
                    {editingId === item.id ? (
                        <div className='flex gap-2 justify-end'>
                            <Button size="icon" className="h-8 w-8" onClick={() => handleSaveEdit(item)}>
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-8 w-8" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onGradeDelete(item.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
