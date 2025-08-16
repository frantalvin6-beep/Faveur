
'use client';

import * as React from 'react';
import { getCourses, getDepartments, addCourse, deleteCourse, Course, Department, updateCourse } from '@/lib/data';
import { CoursesTable, AddCourseForm } from '@/components/academics/courses-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const dynamic = 'force-dynamic';

interface GroupedCourses {
  [level: string]: {
    [department: string]: Course[];
  };
}

export default function CoursesPage() {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const fetchCoursesAndDepartments = React.useCallback(async () => {
        try {
            setLoading(true);
            const [coursesData, departmentsData] = await Promise.all([getCourses(), getDepartments()]);
            setCourses(coursesData);
            setDepartments(departmentsData.filter(d => d.parentId)); // Only options can have courses
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchCoursesAndDepartments();
    }, [fetchCoursesAndDepartments]);

    const handleAddCourse = async (newCourseData: Omit<Course, 'code'>) => {
        try {
            const newCourse = await addCourse(newCourseData);
            toast({ title: 'Matière ajoutée', description: `La matière ${newCourse.name} a été enregistrée.` });
            await fetchCoursesAndDepartments(); // Refetch to get the latest list
        } catch (error) {
            console.error("Failed to add course:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la matière.' });
            throw error; // Re-throw to inform the form component
        }
    };

    const handleDeleteCourse = async (code: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
            try {
                await deleteCourse(code);
                toast({ title: 'Matière supprimée' });
                await fetchCoursesAndDepartments(); // Refetch
            } catch (error) {
                console.error("Failed to delete course:", error);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la matière.' });
            }
        }
    }
    
    const handleUpdateCourse = async (code: string, updatedData: Partial<Course>) => {
        try {
            await updateCourse(code, updatedData);
            toast({ title: 'Matière mise à jour' });
            await fetchCoursesAndDepartments(); // Refetch
        } catch (error) {
            console.error("Failed to update course:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour la matière.' });
        }
    };

    const groupedCourses = React.useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        
        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(lowercasedFilter) ||
            course.code.toLowerCase().includes(lowercasedFilter) ||
            course.department.toLowerCase().includes(lowercasedFilter) ||
            course.level.toLowerCase().includes(lowercasedFilter)
        );

        return filteredCourses.reduce((acc, course) => {
            const { level, department } = course;
            if (!acc[level]) {
                acc[level] = {};
            }
            if (!acc[level][department]) {
                acc[level][department] = [];
            }
            acc[level][department].push(course);
            return acc;
        }, {} as GroupedCourses);
    }, [courses, searchTerm]);

    const sortedLevelKeys = Object.keys(groupedCourses).sort();

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
            <h1 className="text-3xl font-bold">Cours et matières</h1>
            <p className="text-muted-foreground">
                Gérez les cours et les matières proposés par l'université, groupés par niveau et option.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher une matière, option, niveau..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddCourseForm onAddCourse={handleAddCourse} allDepartments={departments} />
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
                            {Object.keys(groupedCourses[level]).sort().map(department => (
                                <AccordionItem value={department} key={`${level}-${department}`}>
                                    <AccordionTrigger className="text-xl">{department}</AccordionTrigger>
                                    <AccordionContent>
                                        <CoursesTable 
                                            data={groupedCourses[level][department]}
                                            onDeleteCourse={handleDeleteCourse}
                                            onUpdateCourse={handleUpdateCourse}
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
                        {searchTerm ? "Aucun cours ou matière ne correspond à votre recherche." : "Aucun cours à afficher."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
