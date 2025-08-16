
'use client';

import * as React from 'react';
import { getStudents, getDepartments, Student, Department } from '@/lib/data';
import { StudentAttendanceTable } from '@/components/students/student-attendance-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

function getLevelName(year: number) {
    if (year <= 3) return `Licence ${year}`;
    return `Master ${year - 3}`;
}

interface GroupedStudents {
  [key: string]: Student[];
}

export default function StudentAttendancePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [students, setStudents] = React.useState<Student[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [studentsData, departmentsData] = await Promise.all([getStudents(), getDepartments()]);
        setStudents(studentsData);
        setDepartments(departmentsData.filter(d => d.parentId)); // Only options
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const groupedStudents = React.useMemo(() => {
    return students.reduce((acc, student) => {
      const key = `${student.department} - ${getLevelName(student.year)}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {} as GroupedStudents);
  }, [students]);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) {
      return groupedStudents;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: GroupedStudents = {};

    for (const groupName in groupedStudents) {
      if (groupName.toLowerCase().includes(lowercasedFilter)) {
        filtered[groupName] = groupedStudents[groupName];
        continue;
      }
      
      const matchingStudents = groupedStudents[groupName].filter(student =>
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.id.toLowerCase().includes(lowercasedFilter)
      );

      if (matchingStudents.length > 0) {
        filtered[groupName] = matchingStudents;
      }
    }
    return filtered;
  }, [searchTerm, groupedStudents]);

  const sortedGroupKeys = Object.keys(filteredGroups).sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><Skeleton className="h-8 w-72" /><Skeleton className="h-4 w-96 mt-2" /></div>
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Suivi de la présence des étudiants</h1>
            <p className="text-muted-foreground">Consultez et saisissez l'assiduité par classe.</p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher par groupe, nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
       </div>
       
       <div className="space-y-8">
            {sortedGroupKeys.length > 0 ? sortedGroupKeys.map((groupName) => (
                <Card key={groupName}>
                    <CardHeader>
                        <CardTitle>{groupName.replace(' - ', ' | ')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StudentAttendanceTable students={filteredGroups[groupName]} />
                    </CardContent>
                </Card>
            )) : (
                 <Card>
                    <CardContent>
                        <p className="text-muted-foreground text-center py-8">
                            {searchTerm ? "Aucun groupe ou étudiant ne correspond à votre recherche." : "Aucun étudiant à afficher."}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  )
}
