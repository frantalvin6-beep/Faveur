
'use client';

import * as React from 'react';
import { getCourses, updateCourse, Course, Chapter } from '@/lib/data';
import { SyllabusTable } from '@/components/academics/syllabus-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const dynamic = 'force-dynamic';

interface ChapterRowData extends Chapter {
  courseCode: string;
  courseName: string;
  level: string;
  department: string;
}

interface GroupedChapters {
    [level: string]: {
        [department: string]: ChapterRowData[];
    };
}

export default function SyllabusPage() {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const fetchCourses = React.useCallback(async () => {
        try {
            // Pas besoin de setLoading(true) ici pour éviter le clignotement lors des rechargements
            const coursesData = await getCourses();
            setCourses(coursesData);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        setLoading(true);
        fetchCourses();
    }, [fetchCourses]);

    const handleCourseUpdate = async (updatedCourse: Course) => {
        try {
            await updateCourse(updatedCourse.code, updatedCourse);
            toast({ title: 'Syllabus mis à jour', description: `Les chapitres pour ${updatedCourse.name} ont été enregistrés.` });
            await fetchCourses(); // Rechargement fiable
        } catch (error) {
            console.error("Failed to update course:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le syllabus.' });
        }
    };
    
    const handleChapterDelete = (courseCode: string, chapterId: string) => {
        const course = courses.find(c => c.code === courseCode);
        if (!course) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer le chapitre "${course.chapters.find(c => c.id === chapterId)?.title}" ?`)) {
            const updatedChapters = course.chapters.filter(c => c.id !== chapterId);
            handleCourseUpdate({ ...course, chapters: updatedChapters });
        }
    };

    const handleChapterUpdate = (courseCode: string, chapterId: string, updatedData: Partial<Chapter>) => {
        const course = courses.find(c => c.code === courseCode);
        if (!course) return;
        
        const updatedChapters = course.chapters.map(c => c.id === chapterId ? { ...c, ...updatedData } : c);
        handleCourseUpdate({ ...course, chapters: updatedChapters });
    };

    const groupedChapters = React.useMemo(() => {
        const allChapters: ChapterRowData[] = [];
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

        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredChapters = !searchTerm 
            ? allChapters
            : allChapters.filter(chapter => 
                chapter.id.toLowerCase().includes(lowercasedFilter) ||
                chapter.title.toLowerCase().includes(lowercasedFilter) ||
                chapter.courseCode.toLowerCase().includes(lowercasedFilter) ||
                chapter.courseName.toLowerCase().includes(lowercasedFilter) ||
                chapter.level.toLowerCase().includes(lowercasedFilter) ||
                chapter.department.toLowerCase().includes(lowercasedFilter)
            );
        
        return filteredChapters.reduce((acc, chapter) => {
            const { level, department } = chapter;
            if (!acc[level]) {
                acc[level] = {};
            }
            if (!acc[level][department]) {
                acc[level][department] = [];
            }
            acc[level][department].push(chapter);
            return acc;
        }, {} as GroupedChapters);

    }, [courses, searchTerm]);

    const sortedLevelKeys = Object.keys(groupedChapters).sort();

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96 mt-2" />
                </div>
                <Skeleton className="h-10 w-72" />
            </div>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

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
                placeholder="Rechercher (niveau, option, matière...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
         </div>
       </div>

        {sortedLevelKeys.length > 0 ? (
            sortedLevelKeys.map(level => (
                <Card key={level}>
                    <CardHeader>
                        <CardTitle>{level}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <Accordion type="single" collapsible className="w-full">
                           {Object.keys(groupedChapters[level]).sort().map(department => (
                               <AccordionItem value={department} key={`${level}-${department}`}>
                                   <AccordionTrigger className="text-xl">{department}</AccordionTrigger>
                                   <AccordionContent>
                                       <SyllabusTable 
                                           data={groupedChapters[level][department]} 
                                           onChapterUpdate={handleChapterUpdate}
                                           onChapterDelete={handleChapterDelete}
                                       />
                                   </AccordionContent>
                               </AccordionItem>
                           ))}
                       </Accordion>
                    </CardContent>
                </Card>
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
