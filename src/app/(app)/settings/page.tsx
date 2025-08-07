
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

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
  const handleAction = (action: string) => alert(`La fonctionnalité "${action}" sera bientôt disponible.`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérer les paramètres de l'application, votre profil et les rôles des utilisateurs.</p>
      </div>

       <Card>
          <CardHeader>
              <CardTitle>Mon Profil</CardTitle>
              <CardDescription>Gérez les informations de votre compte.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person avatar" />
                      <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                      <h2 className="text-xl font-semibold">Admin Principal</h2>
                      <p className="text-muted-foreground">admin@campuscentral.com</p>
                      <Badge>Promoteur</Badge>
                  </div>
                   <div className="ml-auto flex gap-2">
                       <Button variant="outline" onClick={() => handleAction("Télécharger une photo")}>Télécharger une photo</Button>
                       <Button onClick={() => handleAction("Modifier le profil")}>Modifier le profil</Button>
                   </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Sécurité & Accès</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Changer le mot de passe</Label>
                            <Button variant="outline" onClick={() => handleAction("Changer le mot de passe")}>Modifier</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Gérer les permissions du rôle</Label>
                            <Button variant="outline" onClick={() => handleAction("Gérer les permissions")}>Gérer</Button>
                        </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Gestion du Compte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="account-status">Activer / Désactiver le compte</Label>
                                <p className="text-xs text-muted-foreground">Désactiver ce compte empêchera l'accès à la plateforme.</p>
                            </div>
                            <Switch id="account-status" defaultChecked />
                        </div>
                    </CardContent>
                 </Card>
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

      <Card>
        <CardHeader>
          <CardTitle>Base de données</CardTitle>
          <CardDescription>Actions relatives à la base de données de l'application.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div>
                    <Label className="font-semibold">Peupler la base de données</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Initialise la base de données avec des données d'exemple. Ceci est utile pour la première configuration.
                    </p>
                </div>
                <Link href="/seed-data" passHref>
                    <Button variant="outline">Aller à la page de peuplement</Button>
                </Link>
            </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
