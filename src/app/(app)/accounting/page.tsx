
'use client';

import * as React from 'react';
import { accountingTransactions, calculerComptabilite, AccountingTransaction } from '@/lib/data';
import { AccountingTable } from '@/components/accounting/accounting-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
}

export default function AccountingPage() {
  const [transactions, setTransactions] = React.useState<AccountingTransaction[]>(accountingTransactions);
  
  const handleAddTransaction = (newTransaction: AccountingTransaction) => {
    setTransactions(prev => [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const handleDeleteTransaction = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const { revenus, depenses, solde } = React.useMemo(() => calculerComptabilite(transactions), [transactions]);

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
