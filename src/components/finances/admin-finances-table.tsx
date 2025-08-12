
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
import { MoreHorizontal, Edit, PlusCircle, FileSpreadsheet, FileText, FileType, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminFinance, AdminStaff } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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
import { calculerFinanceAdmin } from '@/lib/data';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function getStatusBadgeVariant(status: AdminFinance['statut']) {
  switch (status) {
    case 'Finalisé':
      return 'default';
    case 'Non finalisé':
      return 'destructive';
    default:
      return 'outline';
  }
}

function UpdatePaymentForm({ finance, onUpdate, children }: { finance: AdminFinance, onUpdate: (updatedFinance: AdminFinance) => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [montantPaye, setMontantPaye] = React.useState(finance.montantPaye);

    React.useEffect(() => {
        setMontantPaye(finance.montantPaye);
    }, [finance, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedFinanceData = { ...finance, montantPaye };
        const calculated = calculerFinanceAdmin(
            updatedFinanceData.salaireMensuel,
            updatedFinanceData.indemniteTransport,
            updatedFinanceData.autresAvantages,
            montantPaye,
        );
        onUpdate({ ...updatedFinanceData, ...calculated });
        
        setIsOpen(false);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mettre à jour le paiement pour {finance.fullName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                         <div className="space-y-2">
                            <Label htmlFor="current-total">Total à Payer</Label>
                            <Input id="current-total" value={formatCurrency(finance.totalAPayer)} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current-paid">Montant Actuellement Payé</Label>
                            <Input id="current-paid" value={formatCurrency(finance.montantPaye)} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-paid">Nouveau Montant Total Payé</Label>
                            <Input id="new-paid" type="number" value={montantPaye} onChange={(e) => setMontantPaye(Number(e.target.value))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function AddAdminFinanceForm({ onAdd, allStaff, existingMatricules }: { onAdd: (finance: AdminFinance) => void, allStaff: AdminStaff[], existingMatricules: string[] }) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const [matricule, setMatricule] = React.useState('');
    const [salaireMensuel, setSalaireMensuel] = React.useState(0);
    const [indemniteTransport, setIndemniteTransport] = React.useState(0);
    const [autresAvantages, setAutresAvantages] = React.useState(0);
    const [montantPaye, setMontantPaye] = React.useState(0);
    
    const availableStaff = allStaff.filter(s => !existingMatricules.includes(s.id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const staff = allStaff.find(s => s.id === matricule);
        if (!staff) {
            alert('Veuillez sélectionner un membre du personnel.');
            return;
        }

        const calculated = calculerFinanceAdmin(salaireMensuel, indemniteTransport, autresAvantages, montantPaye);
        
        const newFinance: AdminFinance = {
            matricule,
            fullName: staff.name,
            poste: staff.position,
            salaireMensuel,
            indemniteTransport,
            autresAvantages,
            montantPaye,
            ...calculated
        };

        onAdd(newFinance);
        setIsOpen(false);
        setMatricule('');
        setMontantPaye(0);
        setSalaireMensuel(0);
        setIndemniteTransport(0);
        setAutresAvantages(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={availableStaff.length === 0}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Initialiser la paie
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Initialiser la fiche de paie d'un membre du personnel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
                   <div className="flex-grow overflow-y-auto pr-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-full">
                                <Label>Personnel</Label>
                                <Select onValueChange={setMatricule} value={matricule}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                                    <SelectContent>{availableStaff.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.position})</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Salaire Mensuel</Label><Input type="number" value={salaireMensuel} onChange={(e) => setSalaireMensuel(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Indemnité Transport</Label><Input type="number" value={indemniteTransport} onChange={(e) => setIndemniteTransport(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Autres Avantages</Label><Input type="number" value={autresAvantages} onChange={(e) => setAutresAvantages(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Montant déjà payé (Avance)</Label><Input type="number" value={montantPaye} onChange={(e) => setMontantPaye(Number(e.target.value))} /></div>
                        </div>
                    </div>
                    <DialogFooter className="pt-4 flex-shrink-0">
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AdminFinancesTable({ data, adminStaff, onAddFinance, onUpdateFinance }: { data: AdminFinance[], adminStaff: AdminStaff[], onAddFinance: (finance: AdminFinance) => void, onUpdateFinance: (finance: AdminFinance) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const headers = ["Matricule", "Nom & Prénom", "Poste", "Salaire Mensuel", "Indemnité Transport", "Autres Avantages", "Total à Payer", "Montant Payé", "Reste", "Statut"];
  
  const getExportData = (finances: AdminFinance[]) => finances.map(f => [
      f.matricule, f.fullName, f.poste,
      f.salaireMensuel, f.indemniteTransport, f.autresAvantages,
      f.totalAPayer, f.montantPaye, f.reste, f.statut
  ]);

  const handleExport = (format: 'csv' | 'pdf' | 'word' | 'excel') => {
    if (filteredData.length === 0) {
      toast({ variant: 'destructive', title: 'Exportation impossible', description: 'Aucune donnée à exporter.' });
      return;
    }
    const exportData = getExportData(filteredData);
    const filename = `export-paie-admin-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Paie Admin");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'csv') {
      const csvContent = [headers.join(','), ...exportData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}.csv`);
    } else if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.text("Fiches de Paie du Personnel Administratif", 14, 15);
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
       const doc = new Document({ sections: [{ children: [new Paragraph("Fiches de Paie du Personnel Administratif"), table] }] });
       Packer.toBlob(doc).then(blob => saveAs(blob, `${filename}.docx`));
    }
    toast({ title: `Exportation ${format.toUpperCase()} réussie` });
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Suivi des Paiements Administratifs</CardTitle>
                <CardDescription>Détails financiers du personnel administratif.</CardDescription>
            </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Exporter <ChevronDown className="ml-2 h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('excel')}><FileSpreadsheet className="mr-2 h-4 w-4" />Exporter en Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}><FileSpreadsheet className="mr-2 h-4 w-4" />Exporter en CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}><FileText className="mr-2 h-4 w-4" />Exporter en PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('word')}><FileType className="mr-2 h-4 w-4" />Exporter en Word</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AddAdminFinanceForm onAdd={onAddFinance} allStaff={adminStaff} existingMatricules={data.map(d => d.matricule)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead className="text-right whitespace-nowrap">Salaire Mensuel</TableHead>
                <TableHead className="text-right whitespace-nowrap">Indemnité Transport</TableHead>
                <TableHead className="text-right whitespace-nowrap">Autres Avantages</TableHead>
                <TableHead className="text-right whitespace-nowrap">Total à Payer</TableHead>
                <TableHead className="text-right">Montant payé</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((f) => (
                <TableRow key={f.matricule}>
                  <TableCell className="font-medium">
                      <div>{f.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{f.matricule}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{f.poste}</Badge></TableCell>
                  <TableCell className="text-right">{formatCurrency(f.salaireMensuel)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.indemniteTransport)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.autresAvantages)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(f.totalAPayer)}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">{formatCurrency(f.montantPaye)}</TableCell>
                  <TableCell className={cn("text-right font-bold", f.reste > 0 ? "text-red-600" : "text-gray-500")}>{formatCurrency(f.reste)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(f.statut)}>{f.statut}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <UpdatePaymentForm finance={f} onUpdate={onUpdateFinance}>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                Mettre à jour le paiement
                            </DropdownMenuItem>
                         </UpdatePaymentForm>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">Aucun membre du personnel trouvé.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
