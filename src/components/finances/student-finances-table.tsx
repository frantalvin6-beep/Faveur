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
import { MoreHorizontal, Edit, PlusCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
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
  
  const handleExport = () => {
    if (finances.length === 0) {
        toast({
            variant: "destructive",
            title: "Exportation impossible",
            description: "Il n'y a aucune donnée à exporter dans ce groupe.",
        });
        return;
    }

    const headers = [
        "Matricule", "Nom & Prénom", "Niveau d’études", "Option", "Inscription", "Semestre",
        "Fournitures", "Support", "Type de Bourse", "% Réduction", "Scolarité", "Latrine",
        "Session", "Rattrapage", "Total à Payer", "Avancé", "Reste", "Statut"
    ];

    const csvContent = [
        headers.join(','),
        ...finances.map(f => [
            f.matricule,
            `"${f.fullName}"`,
            f.level,
            f.option,
            f.inscription,
            f.semester,
            f.fournitures,
            f.support,
            `"${f.bourseType}"`,
            f.reduction,
            f.scolariteCalculee,
            f.latrine,
            f.session,
            f.rattrapage,
            f.totalAPayer,
            f.avance,
            f.reste,
            f.statut
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const groupName = finances[0]?.option.replace(/ /g, '_') || 'export';
        link.setAttribute("href", url);
        link.setAttribute("download", `export-finances-${groupName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    toast({
        title: "Exportation réussie",
        description: "Le fichier CSV a été téléchargé.",
    });
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
          <Button onClick={handleExport} variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exporter ce groupe
          </Button>
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
                <TableHead className="text-right">Inscription</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="text-right">Fournitures</TableHead>
                <TableHead className="text-right">Support</TableHead>
                <TableHead>Type de Bourse</TableHead>
                <TableHead>% Réduction</TableHead>
                <TableHead className="text-right">Scolarité</TableHead>
                <TableHead className="text-right">Latrine</TableHead>
                <TableHead className="text-right">Session</TableHead>
                <TableHead className="text-right">Rattrapage</TableHead>
                <TableHead className="text-right">Total à Payer</TableHead>
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
                  <TableCell className="text-right">{formatCurrency(f.inscription)}</TableCell>
                  <TableCell>{f.semester}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.fournitures)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.support)}</TableCell>
                  <TableCell>{f.bourseType}</TableCell>
                  <TableCell>{f.bourseType === 'Partiellement boursier' ? `${f.reduction}%` : 'N/A'}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.scolariteCalculee)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.latrine)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.session)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(f.rattrapage)}</TableCell>
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
                  <TableCell colSpan={19} className="h-24 text-center">Aucun étudiant dans ce groupe.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
