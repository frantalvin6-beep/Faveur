
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getDepartments, getStudents } from "@/lib/data";
import { Users } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Department, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

  const getStudentCountForDept = (deptName: string) => {
    return students.filter(s => s.department === deptName).length;
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
          Visualisation de la distribution des étudiants par faculté et par option.
        </p>
      </div>

      <div className="space-y-8">
        {faculties.map((faculty) => {
            const facultyOptions = options.filter(opt => opt.parentId === faculty.id || departments.find(d => d.id === opt.parentId)?.parentId === faculty.id);
            return(
                <Card key={faculty.id}>
                    <CardHeader>
                        <CardTitle>{faculty.name}</CardTitle>
                        <CardDescription>Responsable: {faculty.head}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {facultyOptions.length > 0 ? facultyOptions.map((dept) => (
                            <Card key={dept.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base font-medium">{dept.name}</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{getStudentCountForDept(dept.name)}</div>
                                    <p className="text-xs text-muted-foreground">étudiants inscrits</p>
                                </CardContent>
                            </Card>
                        )) : (
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
