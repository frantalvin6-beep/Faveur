'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const roles = [
  { 
    name: 'Promoteur',
    meaning: 'Fondateur / Directeur général',
    responsibilities: 'Vision stratégique, décisions globales',
    access: ['Accès complet (super admin)'] 
  },
  { 
    name: 'DAC',
    meaning: 'Directeur Académique',
    responsibilities: 'Supervise l’enseignement, valide programmes, gère enseignants',
    access: ['Gestion académique', 'Examens', 'Rapports']
  },
  { 
    name: 'DAF',
    meaning: 'Directeur Administratif & Financier',
    responsibilities: 'Supervise finances, salaires, budget',
    access: ['Comptabilité', 'Finance Étudiants', 'Finance Enseignants', 'Finance Admin']
  },
  {
    name: 'Secrétaire',
    meaning: 'Secrétaire Général / Bureau',
    responsibilities: 'Gestion dossiers étudiants, inscriptions, communication',
    access: ['Étudiants', 'Communication', 'Archivage']
  },
  {
    name: 'Surveillant',
    meaning: 'Surveillant académique',
    responsibilities: 'Contrôle discipline, présence, suivi examens',
    access: ['Pointage enseignants', 'Présence étudiants']
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérer les paramètres de l'application et les rôles des utilisateurs.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode" disabled aria-readonly />
            <Label htmlFor="dark-mode">Mode sombre (bientôt disponible)</Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rôles & Accès</CardTitle>
          <CardDescription>Définir les rôles et les autorisations pour le personnel de l'université.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste / Rôle</TableHead>
                  <TableHead>Signification</TableHead>
                  <TableHead>Responsabilités principales</TableHead>
                  <TableHead>Accès recommandé</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.name}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.meaning}</TableCell>
                    <TableCell>{role.responsibilities}</TableCell>
                    <TableCell className="flex flex-wrap gap-1 py-4">
                      {role.access.map((permission) => (
                        <Badge key={permission} variant="secondary">{permission}</Badge>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
