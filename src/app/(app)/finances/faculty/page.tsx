'use client';

import * as React from 'react';
import { facultyFinances as initialFacultyFinances, FacultyFinance, calculerSalaireComplet, teacherWorkload, accountingTransactions } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';
import { useToast } from '@/hooks/use-toast';

export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState(initialFacultyFinances);
  const { toast } = useToast();

  // Recalculate all finances based on current workload whenever the component mounts
  // This simulates data being fresh from a database.
  React.useEffect(() => {
    const updatedFinances = initialFacultyFinances.map(finance => {
      const calculated = calculerSalaireComplet(
        finance.teacherId,
        finance.montantPaye,
        finance.tauxL1,
        finance.tauxL2,
        finance.tauxL3,
        finance.tauxMaster
      );
      return { ...finance, ...calculated };
    });
    setFacultyFinances(updatedFinances);
  }, []);

  const handleUpdateFinance = (updatedFinance: FacultyFinance) => {
    const originalFinance = facultyFinances.find(f => f.teacherId === updatedFinance.teacherId);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);

    setFacultyFinances(prev => prev.map(f => f.teacherId === updatedFinance.teacherId ? updatedFinance : f));
    
    if (paymentAmount > 0) {
        accountingTransactions.unshift({
            id: `TRN-FAC-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: updatedFinance.fullName,
            category: 'Salaires',
            amount: paymentAmount,
            paymentMethod: 'Virement bancaire', // Default method
            description: `Paiement salaire enseignant`,
            responsible: 'DRH'
        });
        toast({
            title: "Transaction enregistrée",
            description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
        });
    }
  };
  
  const handleAddFinance = (newFinance: FacultyFinance) => {
     // Prevent duplicates
    if (facultyFinances.some(f => f.teacherId === newFinance.teacherId)) {
        alert('Une fiche de paie pour cet enseignant existe déjà.');
        return;
    }
    setFacultyFinances(prev => [...prev, newFinance]);
    
    if (newFinance.montantPaye > 0) {
        accountingTransactions.unshift({
            id: `TRN-FAC-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: newFinance.fullName,
            category: 'Salaires',
            amount: newFinance.montantPaye,
            paymentMethod: 'Virement bancaire',
            description: `Avance sur salaire enseignant`,
            responsible: 'DRH'
        });
        toast({
            title: "Transaction enregistrée",
            description: `Une dépense de ${newFinance.montantPaye.toLocaleString()} FCFA pour ${newFinance.fullName} a été ajoutée à la comptabilité.`,
        });
    }
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
