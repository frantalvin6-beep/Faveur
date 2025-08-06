
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
  department: string;
}

interface GroupedChapters {
    [department: string]: {
        [level: string]: ChapterRowData[];
    };
}

export default function SyllabusPage() {
    const [courses, setCourses] = React.useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = React.useState('');

    // This useMemo hook now serves as the single source of truth for generating the chapter list.
    const groupedChapters = React.useMemo(() => {
        const allChapters: ChapterRowData[] = [];
        // We iterate through a dynamically updated 'courses' state
        courses.forEach(course => {
            if (course.chapters) {
                course.chapters.forEach(chapter => {
                    allChapters.push({
                        ...chapter,
                        courseCode: course.code,
                        courseName: course.name,
                        level: course.level,
                        department: course.department,
                    });
                });
            }
        });

        const filteredChapters = !searchTerm 
            ? allChapters
            : allChapters.filter(chapter => 
                chapter.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chapter.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chapter.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chapter.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chapter.department.toLowerCase().includes(searchTerm.toLowerCase())
            );
        
        return filteredChapters.reduce((acc, chapter) => {
            const { department, level } = chapter;
            if (!acc[department]) {
                acc[department] = {};
            }
            if (!acc[department][level]) {
                acc[department][level] = [];
            }
            acc[department][level].push(chapter);
            return acc;
        }, {} as GroupedChapters);

    }, [courses, searchTerm]);

    const departmentOrder = Object.keys(groupedChapters).sort();

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
                placeholder="Rechercher (option, matière, chapitre...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
         </div>
       </div>

        {departmentOrder.length > 0 ? (
            departmentOrder.map(department => (
                <div key={department} className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">{department}</h2>
                    {Object.keys(groupedChapters[department]).sort().map(level => (
                         <Card key={`${department}-${level}`}>
                            <CardHeader>
                                <CardTitle>{level}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SyllabusTable data={groupedChapters[department][level]} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ))
        ) : (
             <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun chapitre ne correspond à votre recherche." : "Aucun chapitre à afficher."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
