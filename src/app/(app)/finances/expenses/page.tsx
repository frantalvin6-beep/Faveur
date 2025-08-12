
'use client';

import * as React from 'react';
import { getAccountingTransactions, addAccountingTransaction, deleteAccountingTransaction } from '@/lib/data';
import { ExpensesTable } from '@/components/finances/expenses-table';
import { AccountingTransaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = React.useState<AccountingTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const allTransactions = await getAccountingTransactions();
      const adminExpenses = allTransactions
        .filter(t => t.type === 'Dépense' && t.category !== 'Salaires')
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(adminExpenses);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les dépenses.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleAddExpense = async (newExpenseData: Omit<AccountingTransaction, 'id' | 'type'>) => {
    try {
        const fullExpenseData = { ...newExpenseData, type: 'Dépense' as const };
        const newExpense = await addAccountingTransaction(fullExpenseData);
        setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast({
            title: "Dépense enregistrée",
            description: `Une nouvelle dépense de ${newExpense.amount.toLocaleString()} FCFA a été ajoutée à la comptabilité générale.`,
        });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la dépense.' });
        throw error; // re-throw to inform the form component
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette dépense ? Elle sera également supprimée de la comptabilité générale.")) {
      try {
        await deleteAccountingTransaction(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
        toast({
            title: "Dépense supprimée",
            description: "La dépense a été retirée du journal de comptabilité.",
        });
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la dépense.' });
      }
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
            <h1 className="text-3xl font-bold">Dépenses Administratives</h1>
            <p className="text-muted-foreground">
            Enregistrez et suivez les dépenses administratives courantes de l'université (hors salaires).
            </p>
        </div>
        <ExpensesTable
            data={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
        />
    </div>
  );
}
