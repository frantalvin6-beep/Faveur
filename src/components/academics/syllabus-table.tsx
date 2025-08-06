
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
import { Chapter, Course } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { courses as allCourses } from '@/lib/data';

interface ChapterRowData extends Chapter {
  courseCode: string;
  courseName: string;
  level: string;
}

function EditChapterForm({ chapter, course, onChapterUpdate }: { chapter: ChapterRowData, course: Course | undefined, onChapterUpdate: (courseCode: string, chapterId: string, updatedChapter: Partial<Chapter>) => void }) {
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
            </DropdownMenuTrigger>
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

export function SyllabusTable({ data }: { data: ChapterRowData[] }) {
    const [chaptersData, setChaptersData] = React.useState(data);

    React.useEffect(() => {
        setChaptersData(data);
    }, [data]);
    
    const handleChapterUpdate = (courseCode: string, chapterId: string, updatedChapterData: Partial<Chapter>) => {
        // Update local state for immediate feedback
        setChaptersData(prev => prev.map(ch => 
            (ch.id === chapterId && ch.courseCode === courseCode) ? { ...ch, ...updatedChapterData } : ch
        ));

        // Update the central data source
        const courseToUpdate = allCourses.find(c => c.code === courseCode);
        if (courseToUpdate && courseToUpdate.chapters) {
            const chapterIndex = courseToUpdate.chapters.findIndex(c => c.id === chapterId);
            if (chapterIndex !== -1) {
                courseToUpdate.chapters[chapterIndex] = { 
                    ...courseToUpdate.chapters[chapterIndex], 
                    ...updatedChapterData
                };
            }
        }
    };
    
  const handleDelete = (courseCode: string, chapterId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce chapitre ?")) return;

    // Update local state
    setChaptersData(prev => prev.filter(ch => !(ch.id === chapterId && ch.courseCode === courseCode)));
    
    // Update central data source
    const courseToUpdate = allCourses.find(c => c.code === courseCode);
    if (courseToUpdate && courseToUpdate.chapters) {
        courseToUpdate.chapters = courseToUpdate.chapters.filter(c => c.id !== chapterId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Chapitre</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Nom du Chapitre</TableHead>
            <TableHead>Sous-chapitres</TableHead>
            <TableHead>Durée estimée</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chaptersData.length > 0 ? chaptersData.map((item) => {
            const course = allCourses.find(c => c.code === item.courseCode);
            return (
                <TableRow key={item.id}>
                <TableCell className="font-mono">{item.id}</TableCell>
                <TableCell>
                    <div>{item.courseCode}</div>
                    <div className="text-xs text-muted-foreground">{item.courseName}</div>
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
                            <EditChapterForm chapter={item} course={course} onChapterUpdate={handleChapterUpdate} />
                            <DropdownMenuItem onClick={() => handleDelete(item.courseCode, item.id)} className="text-destructive">
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
