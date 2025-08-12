
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getDepartments, getStudents } from "@/lib/data";
import { Users } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Department, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default function RepartitionPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [departmentsData, studentsData] = await Promise.all([getDepartments(), getStudents()]);
        setDepartments(departmentsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données de répartition.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const getStudentsByLevelForDept = (deptName: string) => {
    const studentsInDept = students.filter(s => s.department === deptName);
    const studentsByLevel = studentsInDept.reduce((acc, student) => {
        const level = `Licence ${student.year}`;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(studentsByLevel).sort(([levelA], [levelB]) => levelA.localeCompare(levelB));
  }
  
  // Regrouper dynamiquement les options par faculté
  const faculties = departments.filter(d => !d.parentId);
  const options = departments.filter(d => d.parentId);

  if (loading) {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-72 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Répartition des Étudiants</h1>
        <p className="text-muted-foreground">
          Visualisation de la distribution des étudiants par faculté, option et niveau.
        </p>
      </div>

      <div className="space-y-8">
        {faculties.map((faculty) => {
            const facultyOptions = options.filter(opt => opt.parentId === faculty.id || departments.find(d => d.id === opt.parentId)?.parentId === faculty.id);
            const totalStudentsInFaculty = facultyOptions.reduce((sum, opt) => sum + students.filter(s => s.department === opt.name).length, 0);

            return(
                <Card key={faculty.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                             <CardTitle>{faculty.name}</CardTitle>
                             <Badge variant="secondary" className="text-lg">{totalStudentsInFaculty} Étudiants</Badge>
                        </div>
                        <CardDescription>Responsable: {faculty.head}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {facultyOptions.length > 0 ? facultyOptions.map((dept) => {
                            const studentsByLevel = getStudentsByLevelForDept(dept.name);
                            const totalStudentsInDept = studentsByLevel.reduce((sum, [, count]) => sum + count, 0);

                            if(totalStudentsInDept === 0) return null;

                            return (
                                <Card key={dept.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base font-medium">{dept.name}</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalStudentsInDept}</div>
                                        <div className="mt-2 space-y-1">
                                            {studentsByLevel.map(([level, count]) => (
                                                 <div key={level} className="text-xs text-muted-foreground flex justify-between items-center">
                                                    <span>{level}</span>
                                                    <span className="font-semibold text-foreground">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }) : (
                           <p className="text-muted-foreground col-span-full text-sm">
                             Aucune option avec des étudiants n'est actuellement rattachée à cette faculté.
                           </p>
                        )}
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
