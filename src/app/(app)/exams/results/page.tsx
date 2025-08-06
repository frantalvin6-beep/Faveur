
'use client';

import * as React from 'react';
import { initialStudents, initialCourses, examGrades as allGrades, departments as allDepartments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Student } from '@/lib/types';
import { processStudentResults, ProcessedStudent, GroupedResults } from '@/lib/results-processor';
import { ResultsTable } from '@/components/exams/results-table';
import { SummaryTable } from '@/components/exams/summary-table';
import { useIsMobile } from '@/hooks/use-mobile'; // Hook to trigger re-render on navigation

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  // This state will be used to trigger re-renders when data changes.
  const [processedResults, setProcessedResults] = React.useState<ProcessedStudent[]>([]);

  // The isMobile hook changes value on navigation, forcing a re-render of the component
  const isMobile = useIsMobile(); 
  
  // Recalculate results whenever the page is rendered (e.g., after navigation)
  React.useEffect(() => {
    setProcessedResults(processStudentResults(initialStudents, allGrades, initialCourses));
  }, [isMobile]); // Re-run effect when the route changes or window resizes past breakpoint


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
