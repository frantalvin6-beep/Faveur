
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
import { Chapter } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface ChapterRowData extends Chapter {
  courseCode: string;
  courseName: string;
  level: string;
}

export function SyllabusTable({ data }: { data: ChapterRowData[] }) {
    
  const handleEdit = (id: string) => alert(`Modification du chapitre ${id} bientôt disponible.`);
  const handleDelete = (id: string) => alert(`Suppression du chapitre ${id} bientôt disponible.`);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Chapitre</TableHead>
            <TableHead>Code Matière</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Nom du Chapitre</TableHead>
            <TableHead>Sous-chapitres</TableHead>
            <TableHead>Durée estimée</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono">{item.id}</TableCell>
              <TableCell>
                <div>{item.courseCode}</div>
                <div className="text-xs text-muted-foreground">{item.courseName}</div>
                </TableCell>
              <TableCell>{item.level}</TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                {item.subChapters && item.subChapters.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {item.subChapters.map((subChapter, subIndex) => (
                      <Badge variant="outline" key={subIndex} className="font-normal">{subChapter.title}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>{item.estimatedDuration}</TableCell>
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
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucun chapitre trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
