'use client';

import * as React from 'react';
import { facultyFinances as initialFacultyFinances, FacultyFinance, calculerSalaireComplet, teacherWorkload } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';

export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState(initialFacultyFinances);

  // Recalculate all finances based on current workload whenever the component mounts
  // This simulates data being fresh from a database.
  React.useEffect(() => {
    const updatedFinances = facultyFinances.map(finance => {
      const calculated = calculerSalaireComplet(finance.teacherId, finance.montantPaye);
      return { ...finance, ...calculated };
    });
    setFacultyFinances(updatedFinances);
  }, []);

  const handleUpdateFinance = (updatedFinance: FacultyFinance) => {
    setFacultyFinances(prev => prev.map(f => f.teacherId === updatedFinance.teacherId ? updatedFinance : f));
  };
  
  const handleAddFinance = (newFinance: FacultyFinance) => {
     // Prevent duplicates
    if (facultyFinances.some(f => f.teacherId === newFinance.teacherId)) {
        alert('Une fiche de paie pour cet enseignant existe déjà.');
        return;
    }
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
