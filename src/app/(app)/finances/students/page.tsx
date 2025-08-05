'use client';

import * as React from 'react';
import { studentFinances, StudentFinance } from '@/lib/data';
import { StudentFinancesTable } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GroupedFinances {
  [key: string]: StudentFinance[];
}

export default function StudentFinancesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const groupedFinances = React.useMemo(() => {
    return studentFinances.reduce((acc, student) => {
      const key = `${student.option} - ${student.level}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {} as GroupedFinances);
  }, []);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) {
      return groupedFinances;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: GroupedFinances = {};

    for (const groupName in groupedFinances) {
      // Check if group name matches
      if (groupName.toLowerCase().includes(lowercasedFilter)) {
        filtered[groupName] = groupedFinances[groupName];
        continue;
      }
      
      // Check if any student in the group matches
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
         <Input
            placeholder="Rechercher par groupe, nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
       </div>

      {sortedGroupKeys.length > 0 ? (
        sortedGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | Niveau: ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentFinancesTable initialData={filteredGroups[groupName]} />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    Aucun groupe ou étudiant ne correspond à votre recherche.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
