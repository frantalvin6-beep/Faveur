
'use client';

import * as React from 'react';
import { StudentFinance, Department } from '@/lib/types';
import { StudentFinancesTableWrapper } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AddStudentFinanceForm } from './add-student-finance-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface GroupedFinances {
  [option: string]: {
    [level: string]: StudentFinance[];
  }
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
      const { level, option } = student;
      if (!acc[option]) {
        acc[option] = {};
      }
      if (!acc[option][level]) {
        acc[option][level] = [];
      }
      acc[option][level].push(student);
      return acc;
    }, {} as GroupedFinances);
  }, [initialFinances]);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) {
      return groupedFinances;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: GroupedFinances = {};

    for (const option in groupedFinances) {
        for (const level in groupedFinances[option]) {
            if (level.toLowerCase().includes(lowercasedFilter) || option.toLowerCase().includes(lowercasedFilter)) {
                if (!filtered[option]) filtered[option] = {};
                filtered[option][level] = groupedFinances[option][level];
                continue;
            }

            const matchingStudents = groupedFinances[option][level].filter(student =>
                student.fullName.toLowerCase().includes(lowercasedFilter) ||
                student.matricule.toLowerCase().includes(lowercasedFilter)
            );

            if (matchingStudents.length > 0) {
                if (!filtered[option]) filtered[option] = {};
                filtered[option][level] = matchingStudents;
            }
        }
    }
    return filtered;
  }, [searchTerm, groupedFinances]);
  
  const sortedDepartmentKeys = Object.keys(filteredGroups).sort();
  
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-end gap-2">
            <Input
                placeholder="Rechercher par option, niveau, nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddStudentFinanceForm onAddStudent={onAddStudent} departments={initialDepartments} />
         </div>

      {sortedDepartmentKeys.length > 0 ? (
        sortedDepartmentKeys.map((option) => (
          <Card key={option}>
            <CardHeader>
              <CardTitle>{option}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.keys(filteredGroups[option]).sort().map(level => (
                    <AccordionItem value={level} key={`${option}-${level}`}>
                       <AccordionTrigger className="text-xl">{level}</AccordionTrigger>
                       <AccordionContent>
                           <StudentFinancesTableWrapper 
                                initialData={filteredGroups[option][level]} 
                                onUpdateStudent={onUpdateStudent}
                            />
                       </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
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
