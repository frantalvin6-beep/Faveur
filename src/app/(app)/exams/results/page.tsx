
'use client';

import * as React from 'react';
import { getStudents, getCourses, getExamGrades } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Student, ExamGrade, Course } from '@/lib/types';
import { processStudentResults, ProcessedStudent, GroupedResults } from '@/lib/results-processor';
import { ResultsTable } from '@/components/exams/results-table';
import { SummaryTable } from '@/components/exams/summary-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [processedResults, setProcessedResults] = React.useState<ProcessedStudent[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            const [students, grades, courses] = await Promise.all([
                getStudents(),
                getExamGrades(),
                getCourses()
            ]);
            setProcessedResults(processStudentResults(students, grades, courses));
        } catch (error) {
            console.error("Failed to fetch and process results:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger et calculer les résultats." });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);


  const groupedResults = React.useMemo(() => {
    const groups: GroupedResults = {};

    processedResults.forEach(student => {
      const groupKey = `${student.department} - ${student.level}`;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(student);
    });

    if (!searchTerm) return groups;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredGroups: GroupedResults = {};

    for (const groupName in groups) {
      if (groupName.toLowerCase().includes(lowercasedFilter)) {
        filteredGroups[groupName] = groups[groupName];
        continue;
      }
      
      const matchingStudents = groups[groupName].filter(student =>
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.id.toLowerCase().includes(lowercasedFilter)
      );

      if (matchingStudents.length > 0) {
        filteredGroups[groupName] = matchingStudents;
      }
    }
    return filteredGroups;
  }, [processedResults, searchTerm]);
  
  const sortedGroupKeys = Object.keys(groupedResults).sort();

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
          <h1 className="text-3xl font-bold">Résultats Globaux</h1>
          <p className="text-muted-foreground">Consultez les résultats détaillés et les décisions finales pour chaque étudiant.</p>
        </div>
        <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher (option, niveau, étudiant...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
      </div>

      {sortedGroupKeys.length > 0 ? sortedGroupKeys.map(groupName => (
        <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | Niveau: ')}</CardTitle>
              <CardDescription>Synthèse des résultats pour ce groupe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <SummaryTable students={groupedResults[groupName]} />
                <ResultsTable students={groupedResults[groupName]} />
            </CardContent>
        </Card>
      )) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucun groupe ou étudiant ne correspond à votre recherche." : "Aucun résultat à afficher."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
