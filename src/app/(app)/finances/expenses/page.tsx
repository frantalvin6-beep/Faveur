'use client';

import * as React from 'react';
import { accountingTransactions } from '@/lib/data';
import { ExpensesTable } from '@/components/finances/expenses-table';
import { AccountingTransaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminExpensesPage() {
  const { toast } = useToast();
  
  // We only show administrative expenses here, not salaries which are handled elsewhere
  const [expenses, setExpenses] = React.useState<AccountingTransaction[]>(
    accountingTransactions.filter(t => t.type === 'Dépense' && t.category !== 'Salaires')
  );

  const handleAddExpense = (newExpense: AccountingTransaction) => {
    // Add to this page's state
    setExpenses(prev => [...prev, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Also add to the main accounting journal
    accountingTransactions.unshift(newExpense);
    
    toast({
      title: "Dépense enregistrée",
      description: `Une nouvelle dépense de ${newExpense.amount.toLocaleString()} FCFA a été ajoutée à la comptabilité générale.`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette dépense ? Elle sera également supprimée de la comptabilité générale.")) {
      // Remove from this page's state
      setExpenses(prev => prev.filter(e => e.id !== id));
      
      // Also remove from the main accounting journal
      const index = accountingTransactions.findIndex(t => t.id === id);
      if (index > -1) {
        accountingTransactions.splice(index, 1);
      }
       toast({
          variant: "destructive",
          title: "Dépense supprimée",
          description: "La dépense a été retirée du journal de comptabilité.",
      });
    }
  };


  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dépenses Administratives</h1>
        <p className="text-muted-foreground">
          Enregistrez et suivez les dépenses administratives courantes de l'université.
        </p>
        <ExpensesTable
            data={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
        />
    </div>
  );
}
