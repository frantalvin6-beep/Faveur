
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
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

function getResultBadge(result: 'Validé' | 'Rattrapage') {
    if (result === 'Validé') return <span className="text-green-600 font-semibold">✅ Validé</span>;
    return <span className="text-red-600 font-semibold">❌ Rattrapage</span>;
}

export function ResultsTable({ students }: { students: ProcessedStudent[] }) {

  return (
    <div className="space-y-2">
        {students.map(student => (
             <Accordion type="single" collapsible key={student.id} className="w-full">
                <AccordionItem value={student.id} className="border rounded-lg">
                     <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-muted/50">
                         <div className='flex justify-between w-full items-center pr-2'>
                             <div className="flex flex-col items-start">
                                <span className="font-semibold text-lg">{student.name}</span>
                                <span className="font-mono text-sm text-muted-foreground">{student.id}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground">Moyenne Générale</span>
                                    <span className="font-bold text-xl">{student.gpa.toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground">Décision</span>
                                    <span className="font-semibold text-lg">{student.finalDecision.icon} {student.finalDecision.text}</span>
                                </div>
                            </div>
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
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
             </Accordion>
        ))}
    </div>
  );
}
