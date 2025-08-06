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
import { PlusCircle, MoreHorizontal, Trash2, ChevronDown, FileSpreadsheet, FileText, FileType } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, AlignmentType } from 'docx';
import { cn } from '@/lib/utils';


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

const transactionCategories = ['Frais scolarité', 'Subvention', 'Salaires', 'Fournitures', 'Maintenance', 'Construction', 'Don', 'Autres'];
const paymentMethods = ['Espèces', 'Virement bancaire', 'Chèque'];

function AddTransactionForm({ onAddTransaction }: { onAddTransaction: (entry: AccountingTransaction) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [type, setType] = React.useState<'Revenu' | 'Dépense'>('Dépense');
  const [date, setDate] = React.useState('');
  const [sourceBeneficiary, setSourceBeneficiary] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = React.useState<AccountingTransaction['paymentMethod']>('Espèces');
  const [description, setDescription] = React.useState('');
  const [responsible, setResponsible] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !date || !sourceBeneficiary || !category || amount <= 0 || !paymentMethod || !responsible) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newTransaction: AccountingTransaction = {
      id: `TRN${Date.now()}`,
      date,
      type,
      sourceBeneficiary,
      category,
      amount,
      paymentMethod,
      description,
      responsible,
    };

    onAddTransaction(newTransaction);
    setIsOpen(false);
    // Reset form
    setType('Dépense');
    setDate('');
    setSourceBeneficiary('');
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
          Ajouter une transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(v: 'Revenu' | 'Dépense') => setType(v)} value={type}>
                <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Revenu">Revenu</SelectItem>
                  <SelectItem value="Dépense">Dépense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceBeneficiary">Source / Bénéficiaire</Label>
              <Input id="sourceBeneficiary" value={sourceBeneficiary} onChange={e => setSourceBeneficiary(e.target.value)} placeholder="Ex: Étudiants, Fournisseur X..." required/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger id="category"><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                <SelectContent>
                  {transactionCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
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
              <Input id="responsible" value={responsible} onChange={e => setResponsible(e.target.value)} placeholder="Ex: Caissier 1, DRH..." required />
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


export function AccountingTable({ data, onAddTransaction, onDeleteTransaction }: { data: AccountingTransaction[], onAddTransaction: (entry: AccountingTransaction) => void, onDeleteTransaction: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  const filteredData = data.filter((item) =>
    Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const headers = ["Date", "Type", "Source/Bénéficiaire", "Catégorie", "Montant", "Moyen de paiement", "Description", "Responsable"];
  
  const getExportData = (transactions: AccountingTransaction[]) => transactions.map(t => [
      t.date, t.type, t.sourceBeneficiary, t.category, t.amount, t.paymentMethod, t.description, t.responsible
  ]);

  const handleExport = (format: 'csv' | 'pdf' | 'word') => {
    if (filteredData.length === 0) {
      toast({ variant: 'destructive', title: 'Exportation impossible', description: 'Aucune donnée à exporter.' });
      return;
    }
    const exportData = getExportData(filteredData);
    const filename = `export-comptabilite-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      const csvContent = [headers.join(','), ...exportData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}.csv`);
    } else if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.text("Journal de Comptabilité", 14, 15);
      autoTable(doc, { startY: 20, head: [headers], body: exportData.map(row => row.map(String)) });
      doc.save(`${filename}.pdf`);
    } else if (format === 'word') {
       const table = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({ tableHeader: true, children: headers.map(h => new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 14 })], alignment: AlignmentType.CENTER })] })) }),
                ...exportData.map(row => new DocxTableRow({ children: row.map(cell => new DocxTableCell({ children: [new Paragraph(String(cell))] })) })),
            ],
       });
       const doc = new Document({ sections: [{ children: [new Paragraph("Journal de Comptabilité"), table] }] });
       Packer.toBlob(doc).then(blob => saveAs(blob, `${filename}.docx`));
    }
    toast({ title: `Exportation ${format.toUpperCase()} réussie` });
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Journal des Transactions</CardTitle>
            <CardDescription>Liste de toutes les transactions financières enregistrées.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Exporter <ChevronDown className="ml-2 h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}><FileSpreadsheet className="mr-2 h-4 w-4" />Exporter en CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}><FileText className="mr-2 h-4 w-4" />Exporter en PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('word')}><FileType className="mr-2 h-4 w-4" />Exporter en Word</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AddTransactionForm onAddTransaction={onAddTransaction} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source/Bénéficiaire</TableHead>
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
                  <TableCell>
                    <Badge variant={item.type === 'Revenu' ? 'default' : 'secondary'} className={cn(item.type === 'Revenu' && 'bg-green-600 hover:bg-green-700')}>
                        {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.sourceBeneficiary}</TableCell>
                  <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  <TableCell className={cn("text-right font-bold", item.type === 'Revenu' ? 'text-green-600' : 'text-red-600')}>
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
                        <DropdownMenuItem onClick={() => onDeleteTransaction(item.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Aucune transaction trouvée.
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
