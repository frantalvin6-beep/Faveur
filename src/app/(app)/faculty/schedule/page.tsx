
'use client';

import * as React from 'react';
import { scheduleData } from '@/lib/data';
import { ScheduleGrid } from '@/components/faculty/schedule-grid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScheduleEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface GroupedSchedule {
  [key: string]: ScheduleEntry[];
}

export default function FacultySchedulePage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const groupedSchedules = React.useMemo(() => {
    return scheduleData.reduce((acc, entry) => {
      const key = `${entry.level} - ${entry.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as GroupedSchedule);
  }, []);

  const filteredGroupKeys = Object.keys(groupedSchedules).filter(key => 
    key.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Emploi du temps par classe</h1>
            <p className="text-muted-foreground">
              Consultez les emplois du temps sous forme de grille hebdomadaire, groupés par niveau et semestre.
            </p>
         </div>
         <Input
            placeholder="Rechercher un niveau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
       </div>
      
      {filteredGroupKeys.length > 0 ? (
        filteredGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleGrid schedule={groupedSchedules[groupName]} />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucun emploi du temps ne correspond à votre recherche." : "Aucun emploi du temps à afficher."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
