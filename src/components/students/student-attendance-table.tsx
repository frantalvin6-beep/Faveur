
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Student } from '@/lib/types';
import { getDaysInMonth, format } from 'date-fns';
import { fr } from 'date-fns/locale';

type AttendanceData = {
    [studentId: string]: {
        [day: string]: {
            attended: number;
            planned: number;
        }
    }
};

function getParticipationColor(percentage: number) {
    if (percentage > 90) return "bg-green-500";
    if (percentage > 80) return "bg-blue-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-red-500";
}

function AttendanceEntryForm({ studentId, day, currentData, onSave, children }: { studentId: string, day: string, currentData: {attended: number, planned: number}, onSave: (studentId: string, day: string, data: {attended: number, planned: number}) => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [attended, setAttended] = React.useState(currentData.attended);
    const [planned, setPlanned] = React.useState(currentData.planned);

    React.useEffect(() => {
        setAttended(currentData.attended);
        setPlanned(currentData.planned);
    }, [currentData, isOpen]);
    
    const handleSave = () => {
        onSave(studentId, day, { attended: Number(attended), planned: Number(planned) });
        setIsOpen(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Saisie pour le {day}</h4>
                        <p className="text-sm text-muted-foreground">Entrez les heures de présence.</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="attended">Présence</Label>
                            <Input id="attended" type="number" value={attended} onChange={(e) => setAttended(Number(e.target.value))} className="h-8" />
                        </div>
                         <div className="grid grid-cols-2 items-center gap-4">
                            <Label htmlFor="planned">Prévues</Label>
                            <Input id="planned" type="number" value={planned} onChange={(e) => setPlanned(Number(e.target.value))} className="h-8" />
                        </div>
                    </div>
                    <Button onClick={handleSave}>Enregistrer</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function StudentAttendanceTable({ students }: { students: Student[] }) {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [attendance, setAttendance] = React.useState<AttendanceData>({});

    const handleSaveAttendance = (studentId: string, day: string, data: {attended: number, planned: number}) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [day]: data
            }
        }));
    };

    const daysInMonth = Array.from(
        { length: getDaysInMonth(currentDate) },
        (_, i) => format(new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1), 'dd/MM')
    );
    
    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2 mb-4">
                 <Button variant="outline" onClick={() => changeMonth(-1)}>Mois Précédent</Button>
                 <span className="font-semibold text-lg capitalize w-32 text-center">
                     {format(currentDate, 'MMMM yyyy', { locale: fr })}
                 </span>
                 <Button variant="outline" onClick={() => changeMonth(1)}>Mois Suivant</Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="sticky left-0 bg-card z-10 w-[200px]">Nom & Prénom</TableHead>
                            {daysInMonth.map(day => (
                                <TableHead key={day} className="text-center w-[70px]">{day.split('/')[0]}</TableHead>
                            ))}
                            <TableHead className="text-center">Total Suivis</TableHead>
                            <TableHead className="text-center">Total Planifiés</TableHead>
                            <TableHead>% Participation</TableHead>
                            <TableHead className="text-center">Absences</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => {
                            const studentAttendance = attendance[student.id] || {};
                            let totalAttended = 0;
                            let totalPlanned = 0;
                            let totalAbsences = 0;

                            for(const day of daysInMonth) {
                                const dayData = studentAttendance[day];
                                if(dayData) {
                                    totalAttended += dayData.attended;
                                    totalPlanned += dayData.planned;
                                    if(dayData.planned > dayData.attended) {
                                        totalAbsences += (dayData.planned - dayData.attended);
                                    }
                                }
                            }
                            
                            const participation = totalPlanned > 0 ? (totalAttended / totalPlanned) * 100 : 0;
                            
                            return (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium sticky left-0 bg-card z-10">{student.name}</TableCell>
                                {daysInMonth.map(day => (
                                    <TableCell key={day} className="text-center p-1">
                                         <AttendanceEntryForm 
                                            studentId={student.id} 
                                            day={day} 
                                            currentData={studentAttendance[day] || {attended: 0, planned: 0}}
                                            onSave={handleSaveAttendance}
                                          >
                                            <div className="w-16 h-8 flex items-center justify-center cursor-pointer hover:bg-muted rounded-md">
                                                {studentAttendance[day] ? `${studentAttendance[day].attended}/${studentAttendance[day].planned}` : '-'}
                                            </div>
                                         </AttendanceEntryForm>
                                    </TableCell>
                                ))}
                                <TableCell className="text-center font-semibold">{totalAttended}</TableCell>
                                <TableCell className="text-center">{totalPlanned}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 w-28">
                                        <Progress value={participation} indicatorClassName={getParticipationColor(participation)} className="h-2"/>
                                        <span className="text-xs font-medium">{participation.toFixed(0)}%</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={totalAbsences > 0 ? "destructive" : "secondary"}>{totalAbsences}h</Badge>
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
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Ajouter une remarque
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Archiver le suivi
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
