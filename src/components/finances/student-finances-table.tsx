
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

function EditableCurrencyCell({ value, onSave }: { value: number, onSave: (newValue: number) => void }) {
    const [currentValue, setCurrentValue] = React.useState(value);
    const [isEditing, setIsEditing] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
        setIsEditing(false);
    };

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.select();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') {
                        setCurrentValue(value);
                        setIsEditing(false);
                    }
                }}
                className="w-32 mx-auto h-8 text-right"
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className="font-semibold text-green-600 cursor-pointer rounded-md p-1 hover:bg-muted"
        >
            {formatCurrency(value)}
        </div>
    );
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
  
  const handleUpdateAdvance = (student: StudentFinance, newAdvance: number) => {
    const updatedStudentData = { ...student, avance: newAdvance };
    const calculated = calculerFinance(
        updatedStudentData.inscription, updatedStudentData.fournitures, updatedStudentData.support, updatedStudentData.bourseType,
        updatedStudentData.reduction, updatedStudentData.scolariteBase, updatedStudentData.latrine, updatedStudentData.session,
        updatedStudentData.rattrapage, newAdvance
    );
    onUpdateStudent({ ...updatedStudentData, ...calculated });
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
                  <TableCell className="text-right">
                    <EditableCurrencyCell 
                        value={f.avance}
                        onSave={(newValue) => handleUpdateAdvance(f, newValue)}
                    />
                  </TableCell>
                  <TableCell className={cn("text-right font-bold", f.reste > 0 ? "text-red-600" : "text-gray-500")}>{formatCurrency(f.reste)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(f.statut)}>{f.statut}</Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">Aucun étudiant dans ce groupe.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
