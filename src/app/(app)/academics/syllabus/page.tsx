
'use client';

import * as React from 'react';
import { courses as initialCourses } from '@/lib/data';
import { SyllabusTable } from '@/components/academics/syllabus-table';
import { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GroupedCourses {
  [department: string]: {
    [level: string]: Course[];
  };
}

export default function SyllabusPage() {
    const [courses, setCourses] = React.useState<Course[]>(initialCourses);
    const [searchTerm, setSearchTerm] = React.useState('');

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
            <h1 className="text-3xl font-bold">Syllabus des Cours</h1>
            <p className="text-muted-foreground">
                Détail des matières avec chapitres et sous-chapitres.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher une matière, option, niveau..."
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
                    {Object.keys(groupedCourses[department]).sort().map(level => (
                        <Card key={`${department}-${level}`}>
                            <CardHeader>
                                <CardTitle>{level}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <SyllabusTable data={groupedCourses[department][level]} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ))
        ) : (
             <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun cours ne correspond à votre recherche." : "Aucun cours à afficher."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
