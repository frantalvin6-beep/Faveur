'use client'

import { useState } from 'react';
import { departments as allDepartments, examGrades as allGrades } from '@/lib/data';
import { GradesTable } from '@/components/exams/grades-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExamGrade } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

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
        const gradesInDept = getGradesForDepartment(dept.name);
        const searchMatchInDeptName = dept.name.toLowerCase().includes(searchTerm.toLowerCase());

        if(!searchTerm) {
            // Si aucun terme de recherche, afficher uniquement les départements qui ont des notes
            return allGrades.some(g => g.department === dept.name);
        }
        
        // S'il y a un terme de recherche, afficher si le nom du département correspond OU s'il y a des notes correspondant à la recherche
        return searchMatchInDeptName || gradesInDept.length > 0;
    });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Notes par Option</h1>
            <p className="text-muted-foreground">Consultez et géerez les notes des étudiants, regroupées par option.</p>
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
                           <Users className="mr-2 h-4 w-4" />
                           Gérer les étudiants
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
