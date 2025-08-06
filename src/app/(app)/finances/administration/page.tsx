'use client';

import * as React from 'react';
import { adminFinances as initialAdminFinances, AdminFinance, calculerFinanceAdmin, adminStaff, accountingTransactions } from '@/lib/data';
import { AdminFinancesTable } from '@/components/finances/admin-finances-table';
import { useToast } from '@/hooks/use-toast';

export default function AdminFinancesPage() {
  const [adminFinances, setAdminFinances] = React.useState(initialAdminFinances);
  const { toast } = useToast();

  React.useEffect(() => {
    const updatedFinances = initialAdminFinances.map(finance => {
      const calculated = calculerFinanceAdmin(
        finance.salaireMensuel,
        finance.indemniteTransport,
        finance.autresAvantages,
        finance.montantPaye
      );
      return { ...finance, ...calculated };
    });
    setAdminFinances(updatedFinances);
  }, []);

  const handleUpdateFinance = (updatedFinance: AdminFinance) => {
    const originalFinance = adminFinances.find(f => f.matricule === updatedFinance.matricule);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);
    
    setAdminFinances(prev => prev.map(f => f.matricule === updatedFinance.matricule ? updatedFinance : f));

    if (paymentAmount > 0) {
        accountingTransactions.unshift({
            id: `TRN-ADM-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: updatedFinance.fullName,
            category: 'Salaires',
            amount: paymentAmount,
            paymentMethod: 'Virement bancaire', // Default method
            description: `Paiement salaire personnel administratif`,
            responsible: 'DRH'
        });
        toast({
            title: "Transaction enregistrée",
            description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
        });
    }
  };
  
  const handleAddFinance = (newFinance: AdminFinance) => {
     if (adminFinances.some(f => f.matricule === newFinance.matricule)) {
        alert('Une fiche de paie pour ce membre du personnel existe déjà.');
        return;
    }
    setAdminFinances(prev => [...prev, newFinance]);

     if (newFinance.montantPaye > 0) {
        accountingTransactions.unshift({
            id: `TRN-ADM-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: newFinance.fullName,
            category: 'Salaires',
            amount: newFinance.montantPaye,
            paymentMethod: 'Virement bancaire',
            description: `Paiement initial salaire personnel administratif`,
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
        <h1 className="text-3xl font-bold">Finances du Personnel Administratif</h1>
        <p className="text-muted-foreground">
          Suivi de la rémunération du personnel administratif sur la base d'un salaire fixe et d'avantages.
        </p>
        <AdminFinancesTable 
            data={adminFinances} 
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
