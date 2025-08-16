
'use client';

import * as React from 'react';
import { getStudents, getDepartments, Student, Department } from '@/lib/data';
import { StudentAttendanceTable } from '@/components/students/student-attendance-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export const dynamic = 'force-dynamic';

function getLevelName(year: number) {
    if (year <= 3) return `Licence ${year}`;
    return `Master ${year - 3}`;
}

interface GroupedStudents {
  [level: string]: {
    [option: string]: Student[];
  }
}

export default function StudentAttendancePage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const studentsData = await getStudents();
        setStudents(studentsData);
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
    let studentsToGroup = students;
    if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        studentsToGroup = students.filter(student =>
            student.name.toLowerCase().includes(lowercasedFilter) ||
            student.id.toLowerCase().includes(lowercasedFilter) ||
            student.department.toLowerCase().includes(lowercasedFilter) ||
            getLevelName(student.year).toLowerCase().includes(lowercasedFilter)
        );
    }
    
    return studentsToGroup.reduce((acc, student) => {
        const level = getLevelName(student.year);
        if (!acc[level]) acc[level] = {};
        if (!acc[level][student.department]) acc[level][student.department] = [];
        acc[level][student.department].push(student);
        return acc;
    }, {} as GroupedStudents);
  }, [students, searchTerm]);

  const sortedLevelKeys = Object.keys(groupedStudents).sort();

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
                placeholder="Rechercher (niveau, option, nom...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
       </div>
       
       <div className="space-y-8">
            {sortedLevelKeys.length > 0 ? sortedLevelKeys.map((level) => {
                const levelOptions = Object.keys(groupedStudents[level]).sort();

                if (levelOptions.length === 0) return null;

                return (
                    <Card key={level}>
                        <CardHeader>
                            <CardTitle className="text-2xl">{level}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible className="w-full">
                                {levelOptions.map(option => (
                                    <AccordionItem value={option} key={`${level}-${option}`}>
                                        <AccordionTrigger className="text-xl">{option}</AccordionTrigger>
                                        <AccordionContent>
                                            <StudentAttendanceTable students={groupedStudents[level][option]} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                           </Accordion>
                        </CardContent>
                    </Card>
                )
            }) : (
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
