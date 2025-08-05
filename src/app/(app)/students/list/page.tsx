'use client'

import { useState } from 'react';
import { students as allStudents, departments as allDepartments } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Student } from '@/lib/types';

export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStudentsForDepartment = (departmentName: string): Student[] => {
    let students = allStudents.filter(student => student.department === departmentName);
    if (searchTerm) {
        students = students.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return students;
  };
  
  const handleRename = (deptName: string) => alert(`La fonctionnalité pour renommer "${deptName}" sera bientôt disponible.`);
  const handleDelete = (deptName: string) => alert(`La fonctionnalité pour supprimer "${deptName}" sera bientôt disponible.`);

   const displayedDepartments = allDepartments.filter(dept => {
        const studentsInDept = getStudentsForDepartment(dept.name);
        const searchMatchInDeptName = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!searchTerm) {
            // If no search term, only show departments that have students
            return allStudents.some(s => s.department === dept.name);
        }
        
        // If there is a search term, show if the department name matches OR if there are students matching the search
        return searchMatchInDeptName || studentsInDept.length > 0;
    });


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Liste des Étudiants par Option</h1>
            <p className="text-muted-foreground">Consultez et gérez les étudiants regroupés par leur option ou département.</p>
         </div>
         <Input
            placeholder="Rechercher un étudiant ou une option..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
       </div>

      {displayedDepartments.map((dept) => {
        const studentsForDept = getStudentsForDepartment(dept.name);
        
        // Hide card if there is a search term and no students were found for this department.
        // But keep it if the search term matches the department name itself.
        if (searchTerm && studentsForDept.length === 0 && !dept.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return null;
        }

        return (
          <Card key={dept.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{dept.name}</CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleRename(dept.name)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Renommer</span>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(dept.name)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <StudentTable data={studentsForDept} />
            </CardContent>
          </Card>
        )
      })}
       {displayedDepartments.length === 0 && searchTerm && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Aucun département ou étudiant ne correspond à votre recherche.
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
