
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
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, ShieldCheck, X } from "lucide-react";
import { Permissions, allRoles, getPermissions, updatePermission } from "@/lib/permissions";
import { UserRole } from "@/lib/types";

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

function EditProfileDialog({ user, onUpdate, children }: { user: { name: string, email: string }, onUpdate: (data: { name: string, email: string }) => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [name, setName] = React.useState(user.name);
    const [email, setEmail] = React.useState(user.email);
    const { toast } = useToast();

    React.useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [isOpen, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ name, email });
        toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse e-mail</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ChangePasswordDialog() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would add your password change logic
        toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été changé avec succès." });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Changer le mot de passe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                     <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Ancien mot de passe</Label>
                            <Input id="current-password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                            <Input id="new-password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                            <Input id="confirm-password" type="password" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Confirmer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const permissionLabels: { [key: string]: string } = {
  'dashboard': 'Tableau de bord',
  'academics/departments': 'Facultés et départements',
  'academics/courses': 'Cours et matières',
  'academics/syllabus': 'Syllabus des cours',
  'academics/calendar': 'Calendrier académique',
  'students/list': 'Liste des étudiants',
  'students/attendance': 'Suivi des étudiants',
  'students/repartition': 'Répartition des étudiants',
  'faculty/profiles': 'Profils enseignants',
  'faculty/assignments': 'Attribution des cours',
  'faculty/schedule': 'Emploi du temps',
  'faculty/workload': 'Charge horaire',
  'faculty/attendance': 'Feuille de présence',
  'exams/grades': 'Saisie des notes',
  'exams/planning': 'Planification des examens',
  'exams/results': 'Résultats Globaux',
  'finances/students': 'Finances Étudiants',
  'finances/faculty': 'Finances Enseignants',
  'finances/administration': 'Finances Administration',
  'finances/expenses': 'Dépenses Administratives',
  'administration/staff': 'Personnel Administratif',
  'accounting': 'Comptabilité',
  'marketing-admin': 'Marketing',
  'settings': 'Paramètres',
};


function PermissionsManager() {
    const [permissions, setPermissions] = React.useState<Permissions | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        async function loadPermissions() {
            const perms = await getPermissions();
            setPermissions(perms);
        }
        loadPermissions();
    }, []);

    const handlePermissionChange = async (path: string, role: UserRole, hasAccess: boolean) => {
        if (!permissions) return;
        
        const currentRoles = permissions[path] || [];
        const newRoles = hasAccess 
            ? [...currentRoles, role] 
            : currentRoles.filter(r => r !== role);

        const newPermissions = { ...permissions, [path]: newRoles };
        setPermissions(newPermissions); // Update UI optimistically

        try {
            await updatePermission(path, newRoles);
            toast({ title: 'Permission mise à jour', description: `L'accès pour le rôle ${role} à ${permissionLabels[path] || path} a été modifié.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de sauvegarder la permission.' });
            setPermissions(permissions); // Revert on error
        }
    };

    if (!permissions) return <p>Chargement des permissions...</p>;

    const availablePaths = Object.keys(permissionLabels);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des Permissions</CardTitle>
                <CardDescription>Activez ou désactivez l'accès à chaque module pour les rôles (hors Promoteur).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Module</TableHead>
                                {allRoles.filter(r => r !== 'Promoteur').map(role => (
                                    <TableHead key={role} className="text-center">{role}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availablePaths.map(path => (
                                <TableRow key={path}>
                                    <TableCell className="font-medium">{permissionLabels[path] || path}</TableCell>
                                    {allRoles.filter(r => r !== 'Promoteur').map(role => (
                                        <TableCell key={role} className="text-center">
                                            <Switch
                                                checked={permissions[path]?.includes(role)}
                                                onCheckedChange={(checked) => handlePermissionChange(path, role, checked)}
                                                aria-label={`Accès pour ${role} à ${path}`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

function ChangeAvatarDialog({ currentAvatar, onUpdate, children }: { currentAvatar: string, onUpdate: (url: string) => void, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [url, setUrl] = React.useState(currentAvatar);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(url);
        toast({ title: "Photo de profil mise à jour" });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier la photo de profil</DialogTitle>
                    <DialogDescription>Collez l'URL d'une image pour mettre à jour votre photo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="avatar-url">URL de l'image</Label>
                            <Input id="avatar-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = React.useState("https://placehold.co/100x100.png");
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState({
      name: "Admin Principal",
      email: "admin@campuscentral.com"
  });

  const handleAccountStatusChange = (checked: boolean) => {
    toast({
      title: `Compte ${checked ? 'activé' : 'désactivé'}`,
      description: `L'accès à la plateforme a été mis à jour.`,
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    toast({
      title: `Mode ${checked ? 'sombre' : 'clair'} activé`,
      description: "L'apparence de l'application a été mise à jour.",
    });
  }

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, []);

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
                      <AvatarImage src={avatarUrl} alt="User avatar" data-ai-hint="person avatar" />
                      <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                      <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                      <p className="text-muted-foreground">{userProfile.email}</p>
                      <Badge>Promoteur</Badge>
                  </div>
                   <div className="ml-auto flex gap-2">
                       <ChangeAvatarDialog currentAvatar={avatarUrl} onUpdate={setAvatarUrl}>
                           <Button variant="outline">Changer la photo</Button>
                       </ChangeAvatarDialog>
                       <EditProfileDialog user={userProfile} onUpdate={setUserProfile}>
                           <Button>Modifier le profil</Button>
                       </EditProfileDialog>
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
                            <ChangePasswordDialog />
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
                                <Label htmlFor="account-status" className="cursor-pointer">Activer / Désactiver le compte</Label>
                                <p className="text-xs text-muted-foreground">Désactiver ce compte empêchera l'accès à la plateforme.</p>
                            </div>
                            <Switch id="account-status" defaultChecked onCheckedChange={handleAccountStatusChange} />
                        </div>
                    </CardContent>
                 </Card>
              </div>
          </CardContent>
      </Card>

      <PermissionsManager />
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rôles</CardTitle>
          <CardDescription>Définitions et responsabilités pour le personnel de l'université.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
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
            <Switch id="dark-mode" onCheckedChange={handleThemeChange} checked={isDarkMode} />
            <Label htmlFor="dark-mode">Mode Sombre</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

    