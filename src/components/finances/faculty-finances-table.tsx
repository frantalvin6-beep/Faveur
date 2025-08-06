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
import { MoreHorizontal, Edit, PlusCircle } from 'lucide-react';
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
import { calculerSalaireComplet, faculty } from '@/lib/data';

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
            updatedFinanceData.heuresL1, updatedFinanceData.tauxL1,
            updatedFinanceData.heuresL2, updatedFinanceData.tauxL2,
            updatedFinanceData.heuresL3, updatedFinanceData.tauxL3,
            updatedFinanceData.heuresMaster, updatedFinanceData.tauxMaster,
            montantPaye
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
    
    // Form state
    const [matricule, setMatricule] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [departement, setDepartement] = React.useState('');
    const [option, setOption] = React.useState('');
    const [heuresL1, setHeuresL1] = React.useState(0);
    const [tauxL1, setTauxL1] = React.useState(0);
    const [heuresL2, setHeuresL2] = React.useState(0);
    const [tauxL2, setTauxL2] = React.useState(0);
    const [heuresL3, setHeuresL3] = React.useState(0);
    const [tauxL3, setTauxL3] = React.useState(0);
    const [heuresMaster, setHeuresMaster] = React.useState(0);
    const [tauxMaster, setTauxMaster] = React.useState(0);
    const [montantPaye, setMontantPaye] = React.useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matricule || !fullName || !departement || !option) {
            alert('Veuillez remplir les champs obligatoires.');
            return;
        }

        const calculated = calculerSalaireComplet(
            heuresL1, tauxL1, heuresL2, tauxL2, heuresL3, tauxL3, heuresMaster, tauxMaster, montantPaye
        );
        
        const newFinance: FacultyFinance = {
            matricule, fullName, departement, option,
            heuresL1, tauxL1, heuresL2, tauxL2, heuresL3, tauxL3,
            heuresMaster, tauxMaster, montantPaye,
            ...calculated
        };

        onAdd(newFinance);
        setIsOpen(false);
        // Reset form or parts of it
        setMatricule('');
        setFullName('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un enseignant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel enseignant aux finances</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
                   <div className="flex-grow overflow-y-auto pr-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                            {/* Champs principaux */}
                            <div className="space-y-2"><Label>Matricule</Label><Input value={matricule} onChange={(e) => setMatricule(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Nom & Prénom</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Département</Label><Input value={departement} onChange={(e) => setDepartement(e.target.value)} required /></div>
                            <div className="space-y-2"><Label>Option (Matière)</Label><Input value={option} onChange={(e) => setOption(e.target.value)} required /></div>
                            
                            {/* Heures & Taux */}
                            <div className="space-y-2"><Label>Heures L1</Label><Input type="number" value={heuresL1} onChange={(e) => setHeuresL1(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux L1</Label><Input type="number" value={tauxL1} onChange={(e) => setTauxL1(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Heures L2</Label><Input type="number" value={heuresL2} onChange={(e) => setHeuresL2(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux L2</Label><Input type="number" value={tauxL2} onChange={(e) => setTauxL2(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Heures L3</Label><Input type="number" value={heuresL3} onChange={(e) => setHeuresL3(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux L3</Label><Input type="number" value={tauxL3} onChange={(e) => setTauxL3(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Heures Master</Label><Input type="number" value={heuresMaster} onChange={(e) => setHeuresMaster(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Taux Master</Label><Input type="number" value={tauxMaster} onChange={(e) => setTauxMaster(Number(e.target.value))} /></div>
                            
                            {/* Paiement */}
                            <div className="space-y-2 col-span-full"><Label>Montant payé</Label><Input type="number" value={montantPaye} onChange={(e) => setMontantPaye(Number(e.target.value))} /></div>
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

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Suivi des Paiements Enseignants</CardTitle>
                <CardDescription>Détails financiers pour chaque enseignant.</CardDescription>
            </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <AddFacultyFinanceForm onAdd={onAddFinance} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Option</TableHead>
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
                  <TableCell className="font-mono text-xs">{f.matricule}</TableCell>
                  <TableCell className="font-medium">{f.fullName}</TableCell>
                  <TableCell><Badge variant="secondary">{f.departement}</Badge></TableCell>
                  <TableCell>{f.option}</TableCell>
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
                  <TableCell colSpan={9} className="h-24 text-center">Aucun enseignant trouvé.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
