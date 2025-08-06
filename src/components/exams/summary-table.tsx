
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
import { ProcessedStudent } from '@/lib/results-processor';

export function SummaryTable({ students }: { students: ProcessedStudent[] }) {

  if (students.length === 0) {
    return <p className="text-muted-foreground text-center">Aucun étudiant dans ce groupe.</p>;
  }

  return (
    <div className="rounded-md border">
        <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead className="text-center">Total Crédits</TableHead>
                <TableHead className="text-center">Moyenne générale</TableHead>
                <TableHead className="text-right">Décision finale</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {students.map(student => (
            <TableRow key={student.id}>
                <TableCell className="font-mono">{student.id}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-center">{student.totalCredits}</TableCell>
                <TableCell className="text-center font-bold text-lg">{student.gpa.toFixed(2)}</TableCell>
                <TableCell className="text-right font-semibold text-lg">{student.finalDecision.icon} {student.finalDecision.text}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
