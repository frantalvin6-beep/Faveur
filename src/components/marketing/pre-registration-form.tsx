
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getDepartments } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { Department } from '@/lib/types';

interface PreRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  fieldOfInterest: string;
  date: string;
}

const STORAGE_KEY = 'pre-registrations';

export function PreRegistrationForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [fieldOfInterest, setFieldOfInterest] = React.useState('');
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [registrations, setRegistrations] = React.useState<PreRegistration[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const storedRegistrations = localStorage.getItem(STORAGE_KEY);
        if (storedRegistrations) {
          setRegistrations(JSON.parse(storedRegistrations));
        }
        const departmentData = await getDepartments();
        setDepartments(departmentData.filter(d => d.parentId)); // Only options
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données nécessaires.' });
      }
    }
    loadData();
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !fieldOfInterest) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    const newRegistration: PreRegistration = {
      id: `PRE-${Date.now()}`,
      name,
      email,
      phone,
      fieldOfInterest,
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations));
    
    toast({ title: 'Pré-inscription réussie', description: `${name} a été ajouté(e) à la liste d'attente.` });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setFieldOfInterest('');
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette pré-inscription ?")) {
        const updatedRegistrations = registrations.filter(r => r.id !== id);
        setRegistrations(updatedRegistrations);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations));
        toast({ title: 'Pré-inscription supprimée' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Formulaire de Pré-inscription</CardTitle>
          <CardDescription>Les futurs étudiants peuvent manifester leur intérêt ici. Les données sont stockées localement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom Complet</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Jean Dupont" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse E-mail</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: jean.dupont@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de Téléphone</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optionnel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Filière d'Intérêt</Label>
              <Select onValueChange={setFieldOfInterest} value={fieldOfInterest} required>
                <SelectTrigger id="field">
                  <SelectValue placeholder="Sélectionner une filière..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Soumettre la pré-inscription</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Prospects</CardTitle>
          <CardDescription>Liste des étudiants pré-inscrits.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border h-96 overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Filière</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length > 0 ? (
                            registrations.map(reg => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.name}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">{reg.email}</div>
                                        <div className="text-xs text-muted-foreground">{reg.phone}</div>
                                    </TableCell>
                                    <TableCell>{reg.fieldOfInterest}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(reg.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">Aucune pré-inscription pour le moment.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
