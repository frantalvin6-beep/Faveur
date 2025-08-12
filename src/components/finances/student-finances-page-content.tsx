
'use client';

import * as React from 'react';
import { StudentFinance, Department } from '@/lib/types';
import { StudentFinancesTableWrapper } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AddStudentFinanceForm } from './add-student-finance-form';

interface GroupedFinances {
  [key: string]: StudentFinance[];
}

interface StudentFinancesPageContentProps {
  initialFinances: StudentFinance[];
  initialDepartments: Department[];
  onAddStudent: (student: StudentFinance) => Promise<void>;
  onUpdateStudent: (student: StudentFinance, newAdvance: number) => Promise<void>;
}

export function StudentFinancesPageContent({ initialFinances, initialDepartments, onAddStudent, onUpdateStudent }: StudentFinancesPageContentProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const groupedFinances = React.useMemo(() => {
    return initialFinances.reduce((acc, student) => {
      const key = `${student.option} - ${student.level}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {} as GroupedFinances);
  }, [initialFinances]);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) {
      return groupedFinances;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: GroupedFinances = {};

    for (const groupName in groupedFinances) {
      if (groupName.toLowerCase().includes(lowercasedFilter)) {
        filtered[groupName] = groupedFinances[groupName];
        continue;
      }
      
      const matchingStudents = groupedFinances[groupName].filter(student =>
        student.fullName.toLowerCase().includes(lowercasedFilter) ||
        student.matricule.toLowerCase().includes(lowercasedFilter)
      );

      if (matchingStudents.length > 0) {
        filtered[groupName] = matchingStudents;
      }
    }
    return filtered;
  }, [searchTerm, groupedFinances]);
  
  const sortedGroupKeys = Object.keys(filteredGroups).sort();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Finances des Étudiants</h1>
            <p className="text-muted-foreground">
              Suivez les frais de scolarité, groupés par option et niveau.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher par groupe, nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddStudentFinanceForm onAddStudent={onAddStudent} departments={initialDepartments} />
         </div>
       </div>

      {sortedGroupKeys.length > 0 ? (
        sortedGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | Niveau: ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentFinancesTableWrapper 
                initialData={filteredGroups[groupName]} 
                onUpdateStudent={onUpdateStudent}
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucun groupe ou étudiant ne correspond à votre recherche." : "Aucune donnée financière à afficher. Ajoutez un étudiant pour commencer."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
