
'use client';

import * as React from 'react';
import { FacultyFinance, calculerSalaireComplet, AccountingTransaction, faculty as allFaculty, getFacultyFinances, updateFacultyFinance, addFacultyFinance, addAccountingTransaction, getFaculty } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Faculty } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState<FacultyFinance[]>([]);
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const refetchData = React.useCallback(async () => {
     try {
        setLoading(true);
        const [financesData, facultyData] = await Promise.all([
            getFacultyFinances(),
            getFaculty()
        ]);
        
        const updatedFinancesPromises = financesData.map(async finance => {
            const calculated = await calculerSalaireComplet(
                finance.teacherId,
                finance.montantPaye,
                finance.tauxL1,
                finance.tauxL2,
                finance.tauxL3,
                finance.tauxMaster
            );
            return { ...finance, ...calculated };
        });

        const updatedFinances = await Promise.all(updatedFinancesPromises);

        setFacultyFinances(updatedFinances);
        setFaculty(facultyData);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données financières.' });
    } finally {
        setLoading(false);
    }
  }, [toast]);


  React.useEffect(() => {
    refetchData();
  }, [refetchData]);

  const handleUpdateFinance = async (updatedFinance: FacultyFinance) => {
    const originalFinance = facultyFinances.find(f => f.teacherId === updatedFinance.teacherId);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);

    try {
        await updateFacultyFinance(updatedFinance.teacherId, updatedFinance);
        
        if (paymentAmount > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: updatedFinance.fullName,
                category: 'Salaires',
                amount: paymentAmount,
                paymentMethod: 'Virement bancaire', // Default method
                description: `Paiement salaire enseignant`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
        await refetchData(); // Refetch to get latest calculated values
        toast({title: "Mise à jour réussie", description: `La fiche de paie de ${updatedFinance.fullName} a été mise à jour.`})

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour la paie.' });
    }
  };
  
  const handleAddFinance = async (newFinance: FacultyFinance) => {
    if (facultyFinances.some(f => f.teacherId === newFinance.teacherId)) {
        toast({variant: 'destructive', title: 'Erreur', description: 'Une fiche de paie pour cet enseignant existe déjà.'});
        return;
    }
    
    try {
        await addFacultyFinance(newFinance);
        
        if (newFinance.montantPaye > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: newFinance.fullName,
                category: 'Salaires',
                amount: newFinance.montantPaye,
                paymentMethod: 'Virement bancaire',
                description: `Avance sur salaire enseignant`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${newFinance.montantPaye.toLocaleString()} FCFA pour ${newFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
        await refetchData(); // Refetch
        toast({title: "Initialisation réussie", description: `La fiche de paie de ${newFinance.fullName} a été créée.`})

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'initialiser la paie.' });
    }
  };

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-96" />
                  <Skeleton className="h-4 w-96 mt-2" />
              </div>
              <Skeleton className="h-80 w-full" />
          </div>
      );
  }


  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Finances des Enseignants</h1>
            <p className="text-muted-foreground">
            Suivi de la rémunération des enseignants basée sur les heures de cours et les taux horaires.
            </p>
        </div>

        <FacultyFinancesTable 
            data={facultyFinances} 
            allFaculty={faculty}
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
