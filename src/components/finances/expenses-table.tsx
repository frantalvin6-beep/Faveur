'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AccountingTransaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

const expenseCategories = [
    'Fournitures', 
    'Maintenance', 
    'Construction',
    'Frais de surveillance',
    'Services professionnels',
    'Marketing et communication',
    'Événements',
    'Déplacements',
    'Autres'
];
const paymentMethods = ['Espèces', 'Virement bancaire', 'Chèque'];

function AddExpenseForm({ onAddExpense }: { onAddExpense: (entry: AccountingTransaction) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [beneficiary, setBeneficiary] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = React.useState<AccountingTransaction['paymentMethod']>('Espèces');
  const [description, setDescription] = React.useState('');
  const [responsible, setResponsible] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !beneficiary || !category || amount <= 0 || !paymentMethod || !responsible) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newTransaction: AccountingTransaction = {
      id: `TRN-EXP-${Date.now()}`,
      date,
      type: 'Dépense',
      sourceBeneficiary: beneficiary,
      category,
      amount,
      paymentMethod,
      description,
      responsible,
    };

    onAddExpense(newTransaction);
    setIsOpen(false);
    // Reset form
    setBeneficiary('');
    setCategory('');
    setAmount(0);
    setPaymentMethod('Espèces');
    setDescription('');
    setResponsible('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Dépense Administrative</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="beneficiary">Bénéficiaire</Label>
              <Input id="beneficiary" value={beneficiary} onChange={e => setBeneficiary(e.target.value)} placeholder="Ex: Fournisseur X, Mission Y..." required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="paymentMethod">Moyen de paiement</Label>
              <Select onValueChange={(v: AccountingTransaction['paymentMethod']) => setPaymentMethod(v)} value={paymentMethod}>
                <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsable</Label>
              <Input id="responsible" value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Ex: DAF, Chef de service..." required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description / Détails</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optionnel" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function ExpensesTable({ data, onAddExpense, onDeleteExpense }: { data: AccountingTransaction[], onAddExpense: (entry: AccountingTransaction) => void, onDeleteExpense: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = data.filter((item) =>
    Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Journal des Dépenses</CardTitle>
            <CardDescription>Liste de toutes les dépenses administratives enregistrées.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <AddExpenseForm onAddExpense={onAddExpense} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bénéficiaire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Moyen de paiement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{item.sourceBeneficiary}</TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>{item.paymentMethod}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDeleteExpense(item.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Aucune dépense trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
