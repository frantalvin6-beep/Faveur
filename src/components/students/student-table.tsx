
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Edit, Trash2, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Student } from '@/lib/types';
import { CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StudentTable({ data, onDeleteStudent }: { data: Student[], onDeleteStudent: (id: string) => void }) {
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification de l'étudiant ${id} sera bientôt implémentée.`);

  return (
    <>
        <div className="flex items-start justify-between mb-4">
            <CardDescription>Consulter et gérer les dossiers des étudiants.</CardDescription>
        </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Département/Option</TableHead>
              <TableHead className="hidden sm:table-cell">Année</TableHead>
              <TableHead className="hidden sm:table-cell">Moyenne</TableHead>
              <TableHead>Sexe</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? data.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                <TableCell><Badge variant="outline">{student.department}</Badge></TableCell>
                <TableCell className="hidden sm:table-cell">{student.year}</TableCell>
                <TableCell className="hidden sm:table-cell">{student.gpa.toFixed(2)}</TableCell>
                <TableCell>{student.gender}</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/students/${student.id}/history`}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Voir l'historique
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(student.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteStudent(student.id)}
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
                        Aucun étudiant trouvé pour cette option.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </>
  );
}
