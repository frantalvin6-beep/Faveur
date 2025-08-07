
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
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExamGrade } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function getGradeColor(grade: number) {
  if (grade >= 15) return 'text-green-600';
  if (grade >= 10) return 'text-blue-600';
  if (grade >= 7) return 'text-orange-600';
  return 'text-red-600';
}

function EditableCell({ value, onSave }: { value: number, onSave: (newValue: number) => void }) {
    const [currentValue, setCurrentValue] = React.useState(value);
    const [isEditing, setIsEditing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    };

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.select();
        }
    }, [isEditing]);
    
    React.useEffect(() => {
        setCurrentValue(value);
    }, [value]);


    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                        setCurrentValue(value);
                        setIsEditing(false);
                    }
                }}
                className="w-24 mx-auto h-8 text-center"
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={cn("font-bold text-lg cursor-pointer rounded-md p-1 hover:bg-muted", getGradeColor(value))}
        >
            {value.toFixed(2)}
        </div>
    );
}


export function GradesTable({ data, onGradeUpdate, onGradeDelete }: { data: ExamGrade[], onGradeUpdate: (grade: ExamGrade) => void, onGradeDelete: (id: string) => void }) {
    const { toast } = useToast();

    if (data.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                Aucune note saisie pour cette session. Cliquez sur "Saisir une note" pour commencer.
            </div>
        )
    }

    const handleSave = (item: ExamGrade, field: 'grade' | 'coefficient', newValue: number) => {
        onGradeUpdate({ ...item, [field]: newValue });
        toast({
            title: "Note mise à jour",
            description: `La modification pour ${item.studentName} a été enregistrée.`
        });
    };

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
            {data.map((item) => (
            <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.studentId}</TableCell>
                <TableCell className="font-medium">{item.studentName}</TableCell>
                
                <TableCell className="text-center">
                    <EditableCell 
                        value={item.grade}
                        onSave={(newValue) => handleSave(item, 'grade', newValue)}
                    />
                </TableCell>
                
                <TableCell className="text-center">
                     <EditableCell 
                        value={item.coefficient}
                        onSave={(newValue) => handleSave(item, 'coefficient', newValue)}
                    />
                </TableCell>
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
                        <DropdownMenuItem
                            onClick={() => onGradeDelete(item.id)}
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
