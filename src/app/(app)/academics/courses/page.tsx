
'use client';

import * as React from 'react';
import { courses as initialCourses } from '@/lib/data';
import { CoursesTable } from '@/components/academics/courses-table';
import { Course } from '@/lib/types';


export default function CoursesPage() {
    const [courses, setCourses] = React.useState<Course[]>(initialCourses);

    const handleAddCourse = (newCourse: Course) => {
        setCourses(prev => [...prev, newCourse]);
        // In a real app, also update the master data source
        initialCourses.push(newCourse);
    };

    const handleDeleteCourse = (code: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
            setCourses(prev => prev.filter(c => c.code !== code));
        }
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cours et matières</h1>
      <p className="text-muted-foreground">
        Gérez les cours et les matières proposés par l'université.
      </p>
      <CoursesTable 
        data={courses} 
        onAddCourse={handleAddCourse}
        onDeleteCourse={handleDeleteCourse}
      />
    </div>
  );
}
