
'use client'

import { useState, useEffect } from 'react';
import { getStudents, getDepartments, Student, Department } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [studentsData, departmentsData] = await Promise.all([getStudents(), getDepartments()]);
        setStudents(studentsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  const getStudentsForDepartment = (departmentName: string): Student[] => {
    let studentsInDept = students.filter(student => student.department === departmentName);
    if (searchTerm) {
        studentsInDept = studentsInDept.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return studentsInDept;
  };

  const handleRename = (deptName: string) => alert(`La fonctionnalité pour renommer "${deptName}" sera bientôt disponible.`);
  const handleDelete = (deptName: string) => alert(`La fonctionnalité pour supprimer "${deptName}" sera bientôt disponible.`);

   const displayedDepartments = departments.filter(dept => {
        const studentsInDept = getStudentsForDepartment(dept.name);
        const searchMatchInDeptName = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!searchTerm) {
            return students.some(s => s.department === dept.name);
        }
        
        return searchMatchInDeptName || studentsInDept.length > 0;
    });

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
       {displayedDepartments.length === 0 && !loading && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun département ou étudiant ne correspond à votre recherche." : "Aucun étudiant à afficher. Commencez par en ajouter un."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
