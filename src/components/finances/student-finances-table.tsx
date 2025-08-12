
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Packer, Document, Paragraph, TextRun, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculerFinance } from '@/lib/data';


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

function EditStudentFinanceForm({
  student,
  onUpdate,
  children
}: {
  student: StudentFinance;
  onUpdate: (updatedStudent: StudentFinance, newAdvance: number) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Omit<StudentFinance, 'totalAPayer' | 'reste' | 'statut' | 'scolariteCalculee'>>({ ...student });
  
  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = calculerFinance(
      formData.inscription, formData.fournitures, formData.support, formData.bourseType,
      formData.reduction, formData.scolariteBase, formData.latrine, formData.session,
      formData.rattrapage, formData.avance
    );
    const updatedStudent: StudentFinance = { ...formData, ...calculated };
    
    onUpdate(updatedStudent, formData.avance);
    setIsOpen(false);
  };
  
   React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...student });
    }
  }, [isOpen, student]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Modifier la Fiche Financière de {student.fullName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow pr-6 -mr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="space-y-2"><Label>Matricule</Label><Input value={formData.matricule} disabled /></div>
              <div className="space-y-2"><Label>Nom & Prénom</Label><Input value={formData.fullName} disabled /></div>
              <div className="space-y-2"><Label>Niveau</Label><Input value={formData.level} disabled /></div>
              
              <div className="space-y-2"><Label>Frais d'inscription</Label><Input type="number" value={formData.inscription} onChange={(e) => handleInputChange('inscription', Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Frais de fournitures</Label><Input type="number" value={formData.fournitures} onChange={(e) => handleInputChange('fournitures', Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Frais de support</Label><Input type="number" value={formData.support} onChange={(e) => handleInputChange('support', Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Frais de latrine</Label><Input type="number" value={formData.latrine} onChange={(e) => handleInputChange('latrine', Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Frais de session</Label><Input type="number" value={formData.session} onChange={(e) => handleInputChange('session', Number(e.target.value))} /></div>
              <div className="space-y-2"><Label>Frais de rattrapage</Label><Input type="number" value={formData.rattrapage} onChange={(e) => handleInputChange('rattrapage', Number(e.target.value))} /></div>
              
              <div className="space-y-2"><Label>Type de Bourse</Label><Select onValueChange={(v: any) => handleInputChange('bourseType', v)} value={formData.bourseType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Non boursier">Non boursier</SelectItem><SelectItem value="Boursier">Boursier</SelectItem><SelectItem value="Partiellement boursier">Partiellement boursier</SelectItem></SelectContent></Select></div>
              {formData.bourseType === 'Partiellement boursier' && <div className="space-y-2"><Label>% Réduction</Label><Input type="number" value={formData.reduction} onChange={(e) => handleInputChange('reduction', Number(e.target.value))} /></div>}
              <div className="space-y-2"><Label>Scolarité de base</Label><Input type="number" value={formData.scolariteBase} onChange={(e) => handleInputChange('scolariteBase', Number(e.target.value))} /></div>
              
              <div className="space-y-2 font-bold"><Label>Avance</Label><Input type="number" value={formData.avance} onChange={(e) => handleInputChange('avance', Number(e.target.value))} /></div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 flex-shrink-0">
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function StudentFinancesTableWrapper({ initialData, onUpdateStudent }: { initialData: StudentFinance[], onUpdateStudent: (student: StudentFinance, newAdvance: number) => void }) {
  const { toast } = useToast();

  const detailedExportHeaders = [
        "Matricule", "Nom & Prénom", "Niveau d’études", "Option", "Frais d'inscription", "Semestre",
        "Frais de fournitures", "Frais de support", "Type de Bourse", "% Réduction", "Scolarité calculée", "Frais de latrine",
        "Frais de session", "Frais de rattrapage", "Total à Payer", "Avancé", "Reste", "Statut"
    ];


  const getDetailedExportData = () => initialData.map(f => [
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

  const getGroupName = () => initialData[0] ? `${initialData[0].option.replace(/ /g, '_')}-${initialData[0].level.replace(/ /g, '_')}` : 'export_sans_nom';
  
  const handleExport = (format: 'csv' | 'pdf' | 'word' | 'excel') => {
    if (initialData.length === 0) {
        toast({ variant: "destructive", title: "Exportation impossible", description: "Il n'y a aucune donnée à exporter." });
        return;
    }
    const filename = `export-finances-${getGroupName()}`;
    const exportData = getDetailedExportData();
    const headers = detailedExportHeaders;

    if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(initialData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finances Étudiants");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'csv') {
        const csvContent = [ headers.join(','), ...exportData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')) ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    } else if (format === 'pdf') {
        const doc = new jsPDF({ orientation: 'landscape' });
        const groupName = initialData[0] ? `${initialData[0].option} - ${initialData[0].level}` : "Export de finances";
        doc.text(groupName, 14, 15);
        autoTable(doc, {
          startY: 20,
          head: [headers],
          body: exportData.map(row => row.map(cell => String(cell))),
        });
        doc.save(`${filename}.pdf`);
    } else if (format === 'word') {
       const groupName = initialData[0] ? `${initialData[0].option} - ${initialData[0].level}` : "Export de finances";
       const table = new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new DocxTableRow({ tableHeader: true, children: headers.map(header => new DocxTableCell({ children: [new Paragraph({ children: [new TextRun({ text: header, bold: true, size: 14 })], alignment: AlignmentType.CENTER })], })) }),
                ...exportData.map(rowData => new DocxTableRow({ children: rowData.map(cellData => new DocxTableCell({ children: [new Paragraph({ text: String(cellData), size: 14 })],})),})),
            ],
        });
       const doc = new Document({ sections: [{ properties: {}, children: [ new Paragraph({ children: [new TextRun({ text: groupName, bold: true, size: 28 })], alignment: AlignmentType.CENTER }), new Paragraph(""), table,],}],});
       Packer.toBlob(doc).then(blob => {
           saveAs(blob, `${filename}.docx`);
       });
    }

    toast({ title: `Exportation ${format.toUpperCase()} réussie` });
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
                <TableHead className="text-right whitespace-nowrap">Total à Payer</TableHead>
                <TableHead className="text-right">Avance</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.length > 0 ? initialData.map((f) => (
                <TableRow key={f.matricule}>
                  <TableCell className="font-mono text-xs">{f.matricule}</TableCell>
                  <TableCell className="font-medium">{f.fullName}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(f.totalAPayer)}</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{formatCurrency(f.avance)}</TableCell>
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
                        <EditStudentFinanceForm student={f} onUpdate={onUpdateStudent}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier la fiche
                          </DropdownMenuItem>
                        </EditStudentFinanceForm>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">Aucun étudiant dans ce groupe.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
