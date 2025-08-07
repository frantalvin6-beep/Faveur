
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
import { FacultyFinance } from '@/lib/types';
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
import { calculerSalaireComplet, faculty } from '@/lib/data';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function getStatusBadgeVariant(status: FacultyFinance['statut']) {
  switch (status) {
    case 'Finalisé':
      return 'default';
    case 'Non finalisé':
      return 'destructive';
    default:
      return 'outline';
  }
}

function UpdatePaymentForm({ finance, onUpdate }: { finance: FacultyFinance, onUpdate: (updatedFinance: FacultyFinance) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [montantPaye, setMontantPaye] = React.useState(finance.montantPaye);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedFinanceData = { ...finance, montantPaye };
        const calculated = calculerSalaireComplet(
            updatedFinanceData.teacherId,
            montantPaye,
            updatedFinanceData.tauxL1,
            updatedFinanceData.tauxL2,
            updatedFinanceData.tauxL3,
            updatedFinanceData.tauxMaster
        );
        onUpdate({ ...updatedFinanceData, ...calculated });
        
        setIsOpen(false);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Mettre à jour le paiement
                </DropdownMenuItem>
            </DropdownMenuTrigger>
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
                            <Label htmlFor="new-paid">Nouveau Montant Payé</Label>
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

function AddFacultyFinanceForm({ onAdd }: { onAdd: (finance: FacultyFinance) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const [teacherId, setTeacherId] = React.useState('');
    const [tauxL1, setTauxL1] = React.useState(8000);
    const [tauxL2, setTauxL2] = React.useState(9000);
    const [tauxL3, setTauxL3] = React.useState(10000);
    const [tauxMaster, setTauxMaster] = React.useState(12000);
    const [montantPaye, setMontantPaye] = React.useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const teacher = faculty.find(f => f.id === teacherId);
        if (!teacher) {
            alert('Veuillez sélectionner un enseignant.');
            return;
        }

        const calculated = calculerSalaireComplet(teacherId, montantPaye, tauxL1, tauxL2, tauxL3, tauxMaster);
        
        const newFinance: FacultyFinance = {
            teacherId,
            fullName: teacher.name,
            departement: teacher.department,
            tauxL1, tauxL2, tauxL3, tauxMaster,
            montantPaye,
            ...calculated
        };

        onAdd(newFinance);
        setIsOpen(false);
        setTeacherId('');
        setMontantPaye(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Initialiser la paie
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Initialiser la fiche de paie d'un enseignant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
                   <div className="flex-grow overflow-y-auto pr-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-full">
                                <Label>Enseignant</Label>
                                <Select onValueChange={setTeacherId} value={teacherId}>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un enseignant..." /></SelectTrigger>
                                    <SelectContent>{faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">Les heures et le total seront calculés à partir de la feuille de présence et de la charge horaire.</p>
                            </div>
                            <div className="space-y-2"><Label>Taux L1</Label><Input type="number" value={tauxL1} onChange={(e) => setTauxL1(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux L2</Label><Input type="number" value={tauxL2} onChange={(e) => setTauxL2(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux L3</Label><Input type="number" value={tauxL3} onChange={(e) => setTauxL3(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux Master</Label><Input type="number" value={tauxMaster} onChange={(e) => setTauxMaster(Number(e.target.value))} /></div>
                            
                            <div className="space-y-2 col-span-full"><Label>Montant déjà payé (Avance)</Label><Input type="number" value={montantPaye} onChange={(e) => setMontantPaye(Number(e.target.value))} /></div>
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

export function FacultyFinancesTable({ data, onAddFinance, onUpdateFinance }: { data: FacultyFinance[], onAddFinance: (finance: FacultyFinance) => void, onUpdateFinance: (finance: FacultyFinance) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.departement.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const headers = ["Matricule", "Nom & Prénom", "Département", "H L1", "Taux L1", "H L2", "Taux L2", "H L3", "Taux L3", "H Master", "Taux Master", "Total à Payer", "Montant Payé", "Reste", "Statut"];
  
  const getExportData = (finances: FacultyFinance[]) => finances.map(f => [
      f.teacherId, f.fullName, f.departement,
      f.heuresL1, f.tauxL1,
      f.heuresL2, f.tauxL2,
      f.heuresL3, f.tauxL3,
      f.heuresMaster, f.tauxMaster,
      f.totalAPayer, f.montantPaye, f.reste, f.statut
  ]);

  const handleExport = (format: 'csv' | 'pdf' | 'word' | 'excel') => {
    if (filteredData.length === 0) {
      toast({ variant: 'destructive', title: 'Exportation impossible', description: 'Aucune donnée à exporter.' });
      return;
    }
    const exportData = getExportData(filteredData);
    const filename = `export-paie-enseignants-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Paie Enseignants");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'csv') {
      const csvContent = [headers.join(','), ...exportData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}.csv`);
    } else if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.text("Fiches de Paie des Enseignants", 14, 15);
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
       const doc = new Document({ sections: [{ children: [new Paragraph("Fiches de Paie des Enseignants"), table] }] });
       Packer.toBlob(doc).then(blob => saveAs(blob, `${filename}.docx`));
    }
    toast({ title: `Exportation ${format.toUpperCase()} réussie` });
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Suivi des Paiements Enseignants</CardTitle>
                <CardDescription>Détails financiers basés sur les heures de présence enregistrées.</CardDescription>
            </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher un enseignant..."
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
            <AddFacultyFinanceForm onAdd={onAddFinance} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enseignant</TableHead>
                <TableHead>Département</TableHead>
                <TableHead className="text-center">H L1</TableHead>
                <TableHead className="text-center">Taux L1</TableHead>
                <TableHead className="text-center">H L2</TableHead>
                <TableHead className="text-center">Taux L2</TableHead>
                <TableHead className="text-center">H L3</TableHead>
                <TableHead className="text-center">Taux L3</TableHead>
                <TableHead className="text-center">H Master</TableHead>
                <TableHead className="text-center">Taux Master</TableHead>
                <TableHead className="text-right whitespace-nowrap">Total à Payer</TableHead>
                <TableHead className="text-right">Montant payé</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((f) => (
                <TableRow key={f.teacherId}>
                  <TableCell className="font-medium">
                      <div>{f.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{f.teacherId}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{f.departement}</Badge></TableCell>
                  <TableCell className="text-center">{f.heuresL1}</TableCell>
                  <TableCell className="text-center">{formatCurrency(f.tauxL1)}</TableCell>
                  <TableCell className="text-center">{f.heuresL2}</TableCell>
                  <TableCell className="text-center">{formatCurrency(f.tauxL2)}</TableCell>
                  <TableCell className="text-center">{f.heuresL3}</TableCell>
                  <TableCell className="text-center">{formatCurrency(f.tauxL3)}</TableCell>
                  <TableCell className="text-center">{f.heuresMaster}</TableCell>
                  <TableCell className="text-center">{formatCurrency(f.tauxMaster)}</TableCell>
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
                         <UpdatePaymentForm finance={f} onUpdate={onUpdateFinance} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={15} className="h-24 text-center">Aucun enseignant trouvé.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
