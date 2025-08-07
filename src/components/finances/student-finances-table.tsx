
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
import { MoreHorizontal, Edit, FileSpreadsheet, FileText, FileType, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StudentFinance } from '@/lib/types';
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
import { cn } from '@/lib/utils';
import { calculerFinance } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function getStatusBadgeVariant(status: StudentFinance['statut']) {
  switch (status) {
    case 'Finalisé':
      return 'default';
    case 'Non finalisé':
      return 'destructive';
    default:
      return 'outline';
  }
}

function UpdateAdvanceForm({ student, onUpdate }: { student: StudentFinance, onUpdate: (updatedStudent: StudentFinance) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [newAdvance, setNewAdvance] = React.useState(student.avance);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedStudentData = { ...student, avance: newAdvance };
        const calculated = calculerFinance(
            updatedStudentData.inscription, updatedStudentData.fournitures, updatedStudentData.support, updatedStudentData.bourseType,
            updatedStudentData.reduction, updatedStudentData.scolariteBase, updatedStudentData.latrine, updatedStudentData.session,
            updatedStudentData.rattrapage, newAdvance
        );
        onUpdate({ ...updatedStudentData, ...calculated });
        
        setIsOpen(false);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    Mettre à jour l'avance
                </DropdownMenuItem>
            </DropdownMenuTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mettre à jour l'avance pour {student.fullName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-total">Total à Payer</Label>
                            <Input id="current-total" value={formatCurrency(student.totalAPayer)} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current-advance">Avance Actuelle</Label>
                            <Input id="current-advance" value={formatCurrency(student.avance)} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-advance">Nouvelle Avance</Label>
                            <Input id="new-advance" type="number" value={newAdvance} onChange={(e) => setNewAdvance(Number(e.target.value))} />
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


export function StudentFinancesTable({ initialData, onUpdateStudent }: { initialData: StudentFinance[], onUpdateStudent: (student: StudentFinance) => void }) {
  const [finances, setFinances] = React.useState(initialData);
  const { toast } = useToast();

  React.useEffect(() => {
    setFinances(initialData);
  }, [initialData]);

  const detailedExportHeaders = [
        "Matricule", "Nom & Prénom", "Niveau d’études", "Option", "Frais d'inscription", "Semestre",
        "Frais de fournitures", "Frais de support", "Type de Bourse", "% Réduction", "Scolarité calculée", "Frais de latrine",
        "Frais de session", "Frais de rattrapage", "Total à Payer", "Avancé", "Reste", "Statut"
    ];


  const getDetailedExportData = () => finances.map(f => [
      f.matricule,
      f.fullName,
      f.level,
      f.option,
      f.inscription,
      f.semester,
      f.fournitures,
      f.support,
      f.bourseType,
      f.reduction,
      f.scolariteCalculee,
      f.latrine,
      f.session,
      f.rattrapage,
      f.totalAPayer,
      f.avance,
      f.reste,
      f.statut
  ]);

  const getGroupName = () => finances[0] ? `${finances[0].option.replace(/ /g, '_')}-${finances[0].level.replace(/ /g, '_')}` : 'export_sans_nom';
  
  const handleExport = (format: 'csv' | 'pdf' | 'word' | 'excel') => {
    if (finances.length === 0) {
        toast({ variant: "destructive", title: "Exportation impossible", description: "Il n'y a aucune donnée à exporter." });
        return;
    }
    const filename = `export-finances-${getGroupName()}`;

    if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(finances);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finances Étudiants");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'csv') {
        const csvContent = [ detailedExportHeaders.join(','), ...getDetailedExportData().map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')) ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    } else if (format === 'pdf') {
        const doc = new jsPDF({ orientation: 'landscape' });
        const groupName = finances[0] ? `${finances[0].option} - ${finances[0].level}` : "Export de finances";
        doc.text(groupName, 14, 15);
        autoTable(doc, {
          startY: 20,
          head: [detailedExportHeaders],
          body: getDetailedExportData().map(row => row.map(cell => String(cell))),
        });
        doc.save(`${filename}.pdf`);
    } else if (format === 'word') {
       const groupName = finances[0] ? `${finances[0].option} - ${finances[0].level}` : "Export de finances";
       const table = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({ tableHeader: true, children: detailedExportHeaders.map(header => new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: header, bold: true, size: 14 })], alignment: AlignmentType.CENTER })], })) }),
                ...getDetailedExportData().map(rowData => new DocxTableRow({ children: rowData.map(cellData => new DocxTableCell({ children: [new Paragraph({ text: String(cellData), size: 14 })],})),})),
            ],
        });
       const doc = new Document({ sections: [{ properties: {}, children: [ new Paragraph({ children: [new TextRun({ text: groupName, bold: true, size: 28 })], alignment: AlignmentType.CENTER }), new Paragraph(""), table,],}],});
       Packer.toBlob(doc).then(blob => {
           saveAs(blob, `${filename}.docx`);
       });
    }

    toast({ title: `Exportation ${format.toUpperCase()} réussie` });
  };
  
  const handleUpdateAdvance = (updatedStudent: StudentFinance) => {
    onUpdateStudent(updatedStudent);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suivi des Paiements</CardTitle>
            <CardDescription>Détails financiers pour chaque étudiant de ce groupe.</CardDescription>
          </div>
          
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Exporter <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exporter en Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exporter en CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exporter en PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('word')}>
                  <FileType className="mr-2 h-4 w-4" />
                  Exporter en Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Niveau d’études</TableHead>
                <TableHead>Option</TableHead>
                <TableHead className="text-right whitespace-nowrap">Total à Payer</TableHead>
                <TableHead className="text-right">Avancé</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finances.length > 0 ? finances.map((f) => (
                <TableRow key={f.matricule}>
                  <TableCell className="font-mono text-xs">{f.matricule}</TableCell>
                  <TableCell className="font-medium">{f.fullName}</TableCell>
                  <TableCell>{f.level}</TableCell>
                  <TableCell><Badge variant="secondary">{f.option}</Badge></TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(f.totalAPayer)}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">{formatCurrency(f.avance)}</TableCell>
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
                         <UpdateAdvanceForm student={f} onUpdate={handleUpdateAdvance} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">Aucun étudiant dans ce groupe.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
