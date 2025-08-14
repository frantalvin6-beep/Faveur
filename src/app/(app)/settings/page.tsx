
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

export default function SettingsPage() {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = React.useState("https://placehold.co/100x100.png");
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState({
      name: "Admin Principal",
      email: "admin@campuscentral.com"
  });

  const handleAction = (action: string) => {
    toast({
      title: "Fonctionnalité en cours de développement",
      description: `L'action "${action}" sera bientôt disponible.`,
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast({
          title: "Photo de profil mise à jour",
          description: "Votre nouvelle photo de profil est maintenant affichée.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
    } else {
        document.documentElement.classList.remove('dark');
    }
    toast({
      title: `Mode ${checked ? 'sombre' : 'clair'} activé`,
      description: "L'apparence de l'application a été mise à jour.",
    });
  }

  React.useEffect(() => {
    // Set initial theme based on system preference or saved setting
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
    } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
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
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                       <Button variant="outline" onClick={handleUploadClick}>Télécharger une photo</Button>
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
            <Switch id="dark-mode" onCheckedChange={handleThemeChange} checked={isDarkMode} />
            <Label htmlFor="dark-mode">Mode Sombre</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
