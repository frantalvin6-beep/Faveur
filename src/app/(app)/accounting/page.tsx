
'use client';

import * as React from 'react';
import { getAccountingTransactions, calculerComptabilite, AccountingTransaction, addAccountingTransaction, deleteAccountingTransaction } from '@/lib/data';
import { AccountingTable } from '@/components/accounting/accounting-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default function AccountingPage() {
  const [transactions, setTransactions] = React.useState<AccountingTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  
  const fetchData = React.useCallback(async () => {
    try {
        setLoading(true);
        const data = await getAccountingTransactions();
        setTransactions(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le journal comptable.' });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleAddTransaction = async (newTransactionData: Omit<AccountingTransaction, 'id'>) => {
    try {
        const newTransaction = await addAccountingTransaction(newTransactionData);
        setTransactions(prev => [newTransaction, ...prev]);
        toast({ title: 'Transaction ajoutée' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la transaction.' });
    }
  };
  
  const handleDeleteTransaction = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      try {
        await deleteAccountingTransaction(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast({ variant: 'destructive', title: 'Transaction supprimée' });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la transaction.' });
      }
    }
  };

  const { revenus, depenses, solde } = React.useMemo(() => calculerComptabilite(transactions), [transactions]);

  if (loading) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-8 w-72" />
              <div className="grid gap-4 md:grid-cols-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-80 w-full" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Comptabilité Générale</h1>
        <p className="text-muted-foreground">
          Suivi des flux financiers de l'université.
        </p>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(revenus)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(depenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Actuel</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(solde)}</div>
          </CardContent>
        </Card>
      </div>
      
      <AccountingTable 
        data={transactions} 
        onAddTransaction={handleAddTransaction} 
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
