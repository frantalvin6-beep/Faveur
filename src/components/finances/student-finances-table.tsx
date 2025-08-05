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
import { MoreHorizontal, Edit, PlusCircle, FileSpreadsheet } from 'lucide-react';
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);
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

export function StudentFinancesTable({ initialData }: { initialData: StudentFinance[] }) {
  const [finances, setFinances] = React.useState(initialData);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFinances = finances.filter(f =>
    f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAdd = () => alert("L'ajout d'un nouvel étudiant sera bientôt disponible.");
  const handleExport = () => alert("L'exportation des données sera bientôt disponible.");
  const handleEdit = (matricule: string) => alert(`La modification pour ${matricule} sera bientôt disponible.`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suivi des Paiements</CardTitle>
            <CardDescription>Détails financiers pour chaque étudiant.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher par nom, matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleAdd} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
            <Button onClick={handleExport}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exporter
            </Button>
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
              {filteredFinances.length > 0 ? filteredFinances.map((f) => (
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
                        <DropdownMenuItem onClick={() => handleEdit(f.matricule)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Mettre à jour l'avance
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={19} className="h-24 text-center">Aucun résultat.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
