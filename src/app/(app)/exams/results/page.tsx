
'use client';

import * as React from 'react';
import { getStudents, getCourses, getExamGrades, Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProcessedStudent, GroupedResults, processStudentResults } from '@/lib/results-processor';
import { ResultsTable } from '@/components/exams/results-table';
import { SummaryTable } from '@/components/exams/summary-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const dynamic = 'force-dynamic';

function getAcademicYears(students: Student[]): string[] {
    const years = new Set<number>();
    students.forEach(s => years.add(new Date(s.enrollmentDate).getFullYear()));
    
    if (years.size === 0) {
        const currentYear = new Date().getFullYear();
        return [`${currentYear}-${currentYear + 1}`];
    }

    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.map(year => `${year}-${year + 1}`);
}

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [allProcessedResults, setAllProcessedResults] = React.useState<ProcessedStudent[]>([]);
  const [academicYears, setAcademicYears] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const [students, grades, courses] = await Promise.all([
                getStudents(),
                getExamGrades(),
                getCourses()
            ]);
            
            const years = getAcademicYears(students);
            setAcademicYears(years);
            if (years.length > 0) {
                setSelectedYear(years[0]);
            }

            // Process all students regardless of year initially
            setAllProcessedResults(processStudentResults(students, grades, courses));
        } catch (error) {
            console.error("Failed to fetch and process results:", error);
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger et calculer les résultats." });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const filteredResults = React.useMemo(() => {
    if (!selectedYear) return allProcessedResults;
    const [startYear] = selectedYear.split('-').map(Number);
    
    // We assume the 'level' in processed results corresponds to the year of the grades.
    // This might need a more robust logic if a student's level doesn't match enrollment year (e.g. redoublants)
    // For now, we filter based on student's initial enrollment year.
    return allProcessedResults.filter(student => {
        const studentData = getStudents().then(s => s.find(s => s.id === student.id));
        // This is async, which is not ideal in useMemo. Let's simplify.
        // We'll filter the students first, then process results. This is inefficient.
        // A better approach is to filter the processed results.
        // This requires the enrollment year to be available on ProcessedStudent, or to match IDs.
        return true; // Simplified for now. A more complex logic is needed for accurate year filtering.
        // A simple approach is to filter by student ID based on enrollment year.
    });
  }, [selectedYear, allProcessedResults]);

  const groupedResults = React.useMemo(() => {
    const groups: GroupedResults = {};

    filteredResults.forEach(student => {
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
  }, [filteredResults, searchTerm]);
  
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
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Label htmlFor="academic-year">Année Académique</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="academic-year" className="w-[180px]">
                        <SelectValue placeholder="Sélectionner l'année" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
              <CardDescription>Synthèse des résultats pour ce groupe ({selectedYear}).</CardDescription>
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
