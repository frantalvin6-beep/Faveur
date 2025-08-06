
'use client';

import * as React from 'react';
import { courses as initialCourses } from '@/lib/data';
import { CoursesTable } from '@/components/academics/courses-table';
import { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddCourseForm } from '@/components/academics/courses-table';

interface GroupedCourses {
  [department: string]: {
    [level: string]: Course[];
  };
}

export default function CoursesPage() {
    const [courses, setCourses] = React.useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleAddCourse = (newCourse: Course) => {
        setCourses(prev => [...prev, newCourse]);
        initialCourses.push(newCourse);
    };

    const handleDeleteCourse = (code: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
            setCourses(prev => prev.filter(c => c.code !== code));
            const index = initialCourses.findIndex(c => c.code === code);
            if (index > -1) initialCourses.splice(index, 1);
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
            <AddCourseForm onAddCourse={handleAddCourse} />
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
