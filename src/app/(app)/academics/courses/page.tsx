
'use client';

import * as React from 'react';
import { getCourses, getDepartments, addCourse, deleteCourse, Course, Department } from '@/lib/data';
import { CoursesTable, AddCourseForm } from '@/components/academics/courses-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface GroupedCourses {
  [department: string]: {
    [level: string]: Course[];
  };
}

export default function CoursesPage() {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    React.useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [coursesData, departmentsData] = await Promise.all([getCourses(), getDepartments()]);
                setCourses(coursesData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [toast]);

    const handleAddCourse = async (newCourse: Course) => {
        try {
            await addCourse(newCourse);
            setCourses(prev => [...prev, newCourse]);
            toast({ title: 'Matière ajoutée', description: `La matière ${newCourse.name} a été enregistrée.` });
        } catch (error) {
            console.error("Failed to add course:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la matière.' });
        }
    };

    const handleDeleteCourse = async (code: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
            try {
                await deleteCourse(code);
                setCourses(prev => prev.filter(c => c.code !== code));
                toast({ title: 'Matière supprimée' });
            } catch (error) {
                console.error("Failed to delete course:", error);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la matière.' });
            }
        }
    }

    const groupedCourses = React.useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        
        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(lowercasedFilter) ||
            course.code.toLowerCase().includes(lowercasedFilter) ||
            course.department.toLowerCase().includes(lowercasedFilter) ||
            course.level.toLowerCase().includes(lowercasedFilter)
        );

        return filteredCourses.reduce((acc, course) => {
            const { department, level } = course;
            if (!acc[department]) {
                acc[department] = {};
            }
            if (!acc[department][level]) {
                acc[department][level] = [];
            }
            acc[department][level].push(course);
            return acc;
        }, {} as GroupedCourses);
    }, [courses, searchTerm]);

    const departmentOrder = Object.keys(groupedCourses).sort();

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
                Gérez les cours et les matières proposés par l'université, groupés par option et niveau.
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

        {departmentOrder.length > 0 ? (
            departmentOrder.map(department => (
                <div key={department} className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">{department}</h2>
                    {Object.keys(groupedCourses[department]).sort().map(level => (
                        <Card key={`${department}-${level}`}>
                            <CardHeader>
                                <CardTitle>{level}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CoursesTable 
                                    data={groupedCourses[department][level]}
                                    onDeleteCourse={handleDeleteCourse}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
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
