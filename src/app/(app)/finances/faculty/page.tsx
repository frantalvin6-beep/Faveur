'use client';

import * as React from 'react';
import { facultyFinances as initialFacultyFinances, FacultyFinance } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';

export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState(initialFacultyFinances);

  const handleUpdateFinance = (updatedFinance: FacultyFinance) => {
    setFacultyFinances(prev => prev.map(f => f.matricule === updatedFinance.matricule ? updatedFinance : f));
  };
  
  const handleAddFinance = (newFinance: FacultyFinance) => {
    setFacultyFinances(prev => [...prev, newFinance]);
  };


  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Finances des Enseignants</h1>
        <p className="text-muted-foreground">
          Suivi de la rémunération des enseignants basée sur les heures de cours et les taux horaires.
        </p>
        <FacultyFinancesTable 
            data={facultyFinances} 
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
