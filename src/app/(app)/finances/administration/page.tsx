
'use client';

import * as React from 'react';
import { AdminFinance, calculerFinanceAdmin, AdminStaff, AccountingTransaction, getAdminFinances, getAdminStaff, addAdminFinance, updateAdminFinance, addAccountingTransaction } from '@/lib/data';
import { AdminFinancesTable } from '@/components/finances/admin-finances-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function AdminFinancesPage() {
  const [adminFinances, setAdminFinances] = React.useState<AdminFinance[]>([]);
  const [adminStaff, setAdminStaff] = React.useState<AdminStaff[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            const [financesData, staffData] = await Promise.all([
                getAdminFinances(),
                getAdminStaff(),
            ]);

            const updatedFinances = financesData.map(finance => {
                const calculated = calculerFinanceAdmin(
                    finance.salaireMensuel,
                    finance.indemniteTransport,
                    finance.autresAvantages,
                    finance.montantPaye
                );
                return { ...finance, ...calculated };
            });

            setAdminFinances(updatedFinances);
            setAdminStaff(staffData);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données financières.' });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleUpdateFinance = async (updatedFinance: AdminFinance) => {
    const originalFinance = adminFinances.find(f => f.matricule === updatedFinance.matricule);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);
    
    try {
        await updateAdminFinance(updatedFinance.matricule, updatedFinance);
        setAdminFinances(prev => prev.map(f => f.matricule === updatedFinance.matricule ? updatedFinance : f));

        if (paymentAmount > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: updatedFinance.fullName,
                category: 'Salaires',
                amount: paymentAmount,
                paymentMethod: 'Virement bancaire',
                description: `Paiement salaire personnel administratif`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour la fiche de paie.' });
    }
  };
  
  const handleAddFinance = async (newFinance: AdminFinance) => {
     if (adminFinances.some(f => f.matricule === newFinance.matricule)) {
        alert('Une fiche de paie pour ce membre du personnel existe déjà.');
        return;
    }
    try {
        await addAdminFinance(newFinance);
        setAdminFinances(prev => [...prev, newFinance]);

        if (newFinance.montantPaye > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: newFinance.fullName,
                category: 'Salaires',
                amount: newFinance.montantPaye,
                paymentMethod: 'Virement bancaire',
                description: `Paiement initial salaire personnel administratif`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${newFinance.montantPaye.toLocaleString()} FCFA pour ${newFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
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
            <h1 className="text-3xl font-bold">Finances du Personnel Administratif</h1>
            <p className="text-muted-foreground">
            Suivi de la rémunération du personnel administratif sur la base d'un salaire fixe et d'avantages.
            </p>
        </div>
        <AdminFinancesTable 
            data={adminFinances}
            adminStaff={adminStaff}
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
