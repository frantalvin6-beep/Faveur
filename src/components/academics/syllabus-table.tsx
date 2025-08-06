
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
import { Course } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function SyllabusTable({ data }: { data: Course[] }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Matière</TableHead>
            <TableHead>Chapitres et Sous-chapitres</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((item) => (
            <TableRow key={item.code}>
              <TableCell className="font-medium align-top">
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.code}</div>
                <Badge variant="secondary" className="mt-2">{item.credits} crédits</Badge>
              </TableCell>
              <TableCell>
                {item.chapters && item.chapters.length > 0 ? (
                  <ul className="space-y-4">
                    {item.chapters.map((chapter, index) => (
                      <li key={index} className="space-y-2">
                        <div className="font-semibold">{index + 1}. {chapter.title}</div>
                        {chapter.subChapters && chapter.subChapters.length > 0 && (
                          <div className="flex flex-wrap gap-2 pl-4">
                            {chapter.subChapters.map((subChapter, subIndex) => (
                              <Badge variant="outline" key={subIndex} className="font-normal">{subChapter.title}</Badge>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun chapitre défini pour cette matière.</p>
                )}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                Aucune matière trouvée pour ce groupe.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
