
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ChapterRowData extends Chapter {
  courseCode: string;
  courseName: string;
  level: string;
}

function EditChapterForm({ chapter, onChapterUpdate, children }: { chapter: ChapterRowData, onChapterUpdate: (courseCode: string, chapterId: string, updatedChapter: Partial<Chapter>) => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState(chapter.title);
    const [subChapters, setSubChapters] = React.useState(chapter.subChapters?.map(sc => sc.title).join('\n') || '');
    const [estimatedDuration, setEstimatedDuration] = React.useState(chapter.estimatedDuration || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedChapter: Partial<Chapter> = {
            title,
            subChapters: subChapters.split('\n').filter(sc => sc.trim() !== '').map(sc => ({ title: sc })),
            estimatedDuration
        };

        onChapterUpdate(chapter.courseCode, chapter.id, updatedChapter);
        setIsOpen(false);
    };

    // Make sure to sync state if the prop changes
    React.useEffect(() => {
        setTitle(chapter.title);
        setSubChapters(chapter.subChapters?.map(sc => sc.title).join('\n') || '');
        setEstimatedDuration(chapter.estimatedDuration || '');
    }, [chapter]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le chapitre</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="chapter-title">Titre du chapitre</Label>
                            <Input id="chapter-title" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subchapters">Sous-chapitres (un par ligne)</Label>
                            <Textarea id="subchapters" value={subChapters} onChange={e => setSubChapters(e.target.value)} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Durée estimée</Label>
                            <Input id="duration" value={estimatedDuration} onChange={e => setEstimatedDuration(e.target.value)} placeholder="Ex: 2h" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function SyllabusTable({ data, onChapterUpdate, onChapterDelete }: { data: ChapterRowData[], onChapterUpdate: (courseCode: string, chapterId: string, updatedData: Partial<Chapter>) => void, onChapterDelete: (courseCode: string, chapterId: string) => void }) {
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID Chapitre</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Titre du Chapitre</TableHead>
            <TableHead>Sous-chapitres</TableHead>
            <TableHead className="w-[120px]">Durée</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((item) => {
            return (
                <TableRow key={`${item.courseCode}-${item.id}`}>
                <TableCell className="font-mono">{item.id}</TableCell>
                <TableCell>
                    <div className="font-medium">{item.courseName}</div>
                    <div className="text-xs text-muted-foreground">{item.courseCode} | {item.level}</div>
                </TableCell>
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
                             <EditChapterForm chapter={item} onChapterUpdate={onChapterUpdate}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Modifier</span>
                                </DropdownMenuItem>
                            </EditChapterForm>
                            <DropdownMenuItem onClick={() => onChapterDelete(item.courseCode, item.id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            )
          }) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun chapitre trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
