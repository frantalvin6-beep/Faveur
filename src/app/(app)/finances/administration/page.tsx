'use client';

import * as React from 'react';
import { adminFinances as initialAdminFinances, AdminFinance, calculerFinanceAdmin, adminStaff } from '@/lib/data';
import { AdminFinancesTable } from '@/components/finances/admin-finances-table';

export default function AdminFinancesPage() {
  const [adminFinances, setAdminFinances] = React.useState(initialAdminFinances);

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
    setAdminFinances(prev => prev.map(f => f.matricule === updatedFinance.matricule ? updatedFinance : f));
  };
  
  const handleAddFinance = (newFinance: AdminFinance) => {
     if (adminFinances.some(f => f.matricule === newFinance.matricule)) {
        alert('Une fiche de paie pour ce membre du personnel existe déjà.');
        return;
    }
    setAdminFinances(prev => [...prev, newFinance]);
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
