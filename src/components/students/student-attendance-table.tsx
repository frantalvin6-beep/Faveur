
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const attendanceData = [
  {
    id: '001',
    name: 'Ndinga Paul',
    class: 'Info L1',
    daily: { '01/09': '3/4', '02/09': '4/4', '03/09': '4/4', '04/09': '2/2', '05/09': '3/3' },
    totalAttended: 85,
    totalPlanned: 90,
    justifiedAbsences: 1,
    unjustifiedAbsences: 2,
    lateness: 0,
    remark: 'Très bon suivi',
  },
  {
    id: '002',
    name: 'Aline M.',
    class: 'Info L1',
    daily: { '01/09': '4/4', '02/09': '3/4', '03/09': '4/4', '04/09': '2/2', '05/09': '3/3' },
    totalAttended: 82,
    totalPlanned: 90,
    justifiedAbsences: 0,
    unjustifiedAbsences: 1,
    lateness: 1,
    remark: 'Améliorer régularité',
  },
  {
    id: '003',
    name: 'Jules K.',
    class: 'Info L1',
    daily: { '01/09': '2/4', '02/09': '3/4', '03/09': '2/4', '04/09': '1/2', '05/09': '1/3' },
    totalAttended: 70,
    totalPlanned: 90,
    justifiedAbsences: 3,
    unjustifiedAbsences: 4,
    lateness: 0,
    remark: 'Risque d’échec',
  },
];


function getParticipationColor(percentage: number) {
    if (percentage > 90) return "bg-green-500";
    if (percentage > 80) return "bg-blue-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-red-500";
}

export function StudentAttendanceTable() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [month, setMonth] = React.useState(new Date().getMonth());

    const filteredData = attendanceData.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const daysInMonth = Array.from({ length: 30 }, (_, i) => `${String(i + 1).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Rapport de Présence Mensuel</CardTitle>
                        <CardDescription>Vue détaillée de l'assiduité des étudiants.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={String(month)} onValueChange={(val) => setMonth(Number(val))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Mois" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i} value={String(i)}>{new Date(0, i).toLocaleString('fr', { month: 'long' })}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Rechercher un étudiant..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-max">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-card z-10 w-[150px]">ID Étudiant</TableHead>
                                <TableHead className="sticky left-[150px] bg-card z-10 w-[200px]">Nom & Prénom</TableHead>
                                <TableHead>Classe / Filière</TableHead>
                                {daysInMonth.slice(0, 5).map(day => ( // Show first 5 days for demo
                                    <TableHead key={day} className="text-center">{day}</TableHead>
                                ))}
                                <TableHead className="text-center">Total Cours Suivis</TableHead>
                                <TableHead className="text-center">Total Cours Planifiés</TableHead>
                                <TableHead>% Participation</TableHead>
                                <TableHead className="text-center">Abs (J)</TableHead>
                                <TableHead className="text-center">Abs (NJ)</TableHead>
                                <TableHead className="text-center">Retards</TableHead>
                                <TableHead>Remarque / Action</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map(student => {
                                const participation = (student.totalAttended / student.totalPlanned) * 100;
                                return (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono sticky left-0 bg-card z-10">{student.id}</TableCell>
                                    <TableCell className="font-medium sticky left-[150px] bg-card z-10">{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    {daysInMonth.slice(0, 5).map(day => (
                                        <TableCell key={day} className="text-center">
                                            {student.daily[day.slice(0,5) as keyof typeof student.daily] || '-'}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-center font-semibold">{student.totalAttended}</TableCell>
                                    <TableCell className="text-center">{student.totalPlanned}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={participation} indicatorClassName={getParticipationColor(participation)} className="h-2"/>
                                            <span className="text-xs font-medium">{participation.toFixed(1)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center"><Badge variant="secondary">{student.justifiedAbsences}</Badge></TableCell>
                                    <TableCell className="text-center"><Badge variant="destructive">{student.unjustifiedAbsences}</Badge></TableCell>
                                    <TableCell className="text-center"><Badge variant="outline">{student.lateness}</Badge></TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{student.remark}</TableCell>
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
            </CardContent>
        </Card>
    );
}

