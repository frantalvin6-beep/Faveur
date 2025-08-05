'use client'

import { useState } from 'react';
import { departments as allDepartments, examGrades as allGrades } from '@/lib/data';
import { GradesTable } from '@/components/exams/grades-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExamGrade } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function GradesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getGradesForDepartment = (departmentName: string): ExamGrade[] => {
    let grades = allGrades.filter(grade => grade.department === departmentName);
    if (searchTerm) {
        grades = grades.filter((grade) =>
            grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return grades;
  };
  
  const displayedDepartments = allDepartments.filter(dept => {
        const gradesInDept = allGrades.some(g => g.department === dept.name);
        const searchMatch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        return gradesInDept || searchMatch;
    });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Notes par Option</h1>
            <p className="text-muted-foreground">Consultez et gérez les notes des étudiants, regroupées par option.</p>
         </div>
         <Input
            placeholder="Rechercher une note ou une option..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
       </div>

      {displayedDepartments.map((dept) => {
        const gradesForDept = getGradesForDepartment(dept.name);
        
        if (searchTerm && gradesForDept.length === 0 && !dept.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return null;
        }

        return (
          <Card key={dept.id}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{dept.name}</CardTitle>
                    <Button asChild variant="outline">
                        <Link href="/students/list">
                           <BookOpen className="mr-2 h-4 w-4" />
                           Aller à la saisie
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <GradesTable data={gradesForDept} />
            </CardContent>
          </Card>
        )
      })}
       {displayedDepartments.length === 0 && searchTerm && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Aucune option ou note ne correspond à votre recherche.
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
