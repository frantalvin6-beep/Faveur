
'use client';

import * as React from 'react';
import { courses as initialCourses } from '@/lib/data';
import { SyllabusTable } from '@/components/academics/syllabus-table';
import { Course, Chapter } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChapterRowData extends Chapter {
  courseCode: string;
  courseName: string;
  level: string;
}

export default function SyllabusPage() {
    const [courses, setCourses] = React.useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = React.useState('');

    const chapterData = React.useMemo(() => {
        const allChapters: ChapterRowData[] = [];
        courses.forEach(course => {
            if (course.chapters) {
                course.chapters.forEach(chapter => {
                    allChapters.push({
                        ...chapter,
                        courseCode: course.code,
                        courseName: course.name,
                        level: course.level,
                    });
                });
            }
        });

        if (!searchTerm) return allChapters;

        const lowercasedFilter = searchTerm.toLowerCase();
        return allChapters.filter(chapter => 
            chapter.id.toLowerCase().includes(lowercasedFilter) ||
            chapter.title.toLowerCase().includes(lowercasedFilter) ||
            chapter.courseCode.toLowerCase().includes(lowercasedFilter) ||
            chapter.courseName.toLowerCase().includes(lowercasedFilter) ||
            chapter.level.toLowerCase().includes(lowercasedFilter)
        );

    }, [courses, searchTerm]);


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Syllabus des Cours</h1>
            <p className="text-muted-foreground">
                Détail des matières avec chapitres, sous-chapitres et durée estimée.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher (ID, matière, chapitre...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
         </div>
       </div>
        <Card>
            <CardContent className="pt-6">
                <SyllabusTable data={chapterData} />
            </CardContent>
        </Card>
    </div>
  );
}
