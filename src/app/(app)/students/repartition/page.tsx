
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getDepartments, getStudents } from "@/lib/data";
import { Users } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Department, Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const filieres = [
    {
        name: "Filière : IA & Business",
        departments: ["Département IA et Robotique", "Département Big Data", "Département Intelligence Artificielle (IA)", "Département Programmation", "Département Mécatronique"]
    },
    {
        name: "Filière : Numérique (Industrielle et Technologique)",
        departments: ["Département Génie Électrique et Informatique Industrielle", "Département Génie Informatique", "Filière Génie Civil", "Électronique"]
    },
    {
        name: "Filière : Digital Business",
        departments: ["Ressources Humaines axées Digital"]
    }
]

export default function RepartitionPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
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
          Visualisation de la distribution des étudiants par filière et département.
        </p>
      </div>

      <div className="space-y-8">
        {filieres.map((filiere) => (
            <Card key={filiere.name}>
                <CardHeader>
                    <CardTitle>{filiere.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departments
                        .filter(d => d.parentId && filiere.departments.includes(d.name))
                        .map((dept) => (
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
                    ))}
                     {departments.filter(d => d.parentId && filiere.departments.includes(d.name)).length === 0 && (
                        <p className="text-muted-foreground col-span-full">Aucun département de cette filière n'a d'étudiants pour le moment.</p>
                     )}
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
