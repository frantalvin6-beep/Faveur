
'use client'

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProcessedStudent } from '@/lib/results-processor';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

function getResultBadge(result: 'Validé' | 'Rattrapage') {
    if (result === 'Validé') return <span className="text-green-600 font-semibold">✅ Validé</span>;
    return <span className="text-red-600 font-semibold">❌ Rattrapage</span>;
}

export function ResultsTable({ students }: { students: ProcessedStudent[] }) {

  return (
    <Accordion type="multiple" className="w-full space-y-4">
        {students.map(student => (
            <AccordionItem value={student.id} key={student.id} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-2 hover:no-underline">
                     <div className="flex flex-col items-start">
                        <span className="font-semibold text-lg">{student.name}</span>
                        <span className="font-mono text-sm text-muted-foreground">{student.id}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="rounded-md border-t">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Matière</TableHead>
                                <TableHead className="text-center">Crédits</TableHead>
                                <TableHead className="text-center">Contrôle</TableHead>
                                <TableHead className="text-center">Partiel</TableHead>
                                <TableHead className="text-center">Session</TableHead>
                                <TableHead className="text-center font-bold">Moyenne Matière</TableHead>
                                <TableHead className="text-right">Résultat</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.courses.map(course => (
                                    <TableRow key={course.name}>
                                        <TableCell className="font-medium">{course.name}</TableCell>
                                        <TableCell className="text-center">{course.credits}</TableCell>
                                        <TableCell className="text-center">{course.grades.Contrôle ?? '-'}</TableCell>
                                        <TableCell className="text-center">{course.grades.Partiel ?? '-'}</TableCell>
                                        <TableCell className="text-center">{course.grades.Final ?? '-'}</TableCell>
                                        <TableCell className={cn("text-center font-bold", course.average >= 10 ? 'text-green-700' : 'text-red-700')}>
                                            {course.average.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">{getResultBadge(course.result)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/50 font-bold">
                                    <TableCell colSpan={6} className="text-right">Résumé</TableCell>
                                    <TableCell colSpan={2} className="text-right"></TableCell>
                                </TableRow>
                                 <TableRow className="bg-muted/50">
                                    <TableCell colSpan={1} className="text-right font-semibold">Total / Moyenne</TableCell>
                                    <TableCell className="text-center font-bold">{student.totalCredits}</TableCell>
                                    <TableCell colSpan={3}></TableCell>
                                    <TableCell className="text-center font-bold text-xl">{student.gpa.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-semibold">{student.finalDecision.icon} {student.finalDecision.text}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  );
}
