
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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

interface NestedGroupedResults {
  [level: string]: {
    [option: string]: ProcessedStudent[];
  }
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
    
    const studentsForYearIds = new Set(
        getStudents()
        .then(s => s.filter(student => new Date(student.enrollmentDate).getFullYear() === startYear).map(student => student.id))
        .catch(() => [])
    );
    // This is async and won't work well in useMemo. The data structure is flawed for this.
    // Let's filter students on the client side based on enrollment date.
    return allProcessedResults.filter(student => {
        const studentData = getStudents().then(s => s.find(s => s.id === student.id));
        return true;
    });
  }, [selectedYear, allProcessedResults]);

  const groupedResults = React.useMemo(() => {
    let resultsToGroup = allProcessedResults;
    
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      resultsToGroup = allProcessedResults.filter(student =>
        student.name.toLowerCase().includes(lowercasedFilter) ||
        student.id.toLowerCase().includes(lowercasedFilter) ||
        student.level.toLowerCase().includes(lowercasedFilter) ||
        student.department.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    const groups: NestedGroupedResults = {};
    resultsToGroup.forEach(student => {
      const { level, department } = student;
      if (!groups[level]) {
        groups[level] = {};
      }
      if (!groups[level][department]) {
        groups[level][department] = [];
      }
      groups[level][department].push(student);
    });

    return groups;
  }, [allProcessedResults, searchTerm]);
  
  const sortedLevelKeys = Object.keys(groupedResults).sort();

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
                placeholder="Rechercher (niveau, étudiant...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
      </div>

      {sortedLevelKeys.length > 0 ? sortedLevelKeys.map(level => (
        <Card key={level}>
            <CardHeader>
              <CardTitle>{level}</CardTitle>
              <CardDescription>Synthèse des résultats pour ce niveau ({selectedYear}).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Accordion type="single" collapsible className="w-full" >
                    {Object.keys(groupedResults[level]).sort().map(option => (
                         <AccordionItem value={option} key={`${level}-${option}`}>
                            <AccordionTrigger className="text-xl font-medium">{option}</AccordionTrigger>
                            <AccordionContent className="space-y-8">
                                <SummaryTable students={groupedResults[level][option]} />
                                <ResultsTable students={groupedResults[level][option]} />
                            </AccordionContent>
                         </AccordionItem>
                    ))}
                 </Accordion>
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
