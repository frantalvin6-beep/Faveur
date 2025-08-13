
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getDepartments, addPreRegistration } from '@/lib/data';
import { Department } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function PreRegistrationForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [fieldOfInterest, setFieldOfInterest] = React.useState('');
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        const departmentData = await getDepartments();
        setDepartments(departmentData.filter(d => d.parentId)); // Only options
      } catch (error) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les filières disponibles.' });
      }
    }
    loadData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !fieldOfInterest || !level) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    
    setLoading(true);

    try {
        await addPreRegistration({
            name, email, phone, level, fieldOfInterest,
            status: 'En attente',
            date: new Date().toISOString()
        });
        toast({ title: 'Pré-inscription réussie', description: `${name}, votre demande a été envoyée. Nous vous contacterons bientôt.` });
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setFieldOfInterest('');
        setLevel('');
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue. Veuillez réessayer.'});
    } finally {
        setLoading(false);
    }
  };

  const levelOptions = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Formulaire de Pré-inscription</CardTitle>
          <CardDescription>Manifestez votre intérêt pour rejoindre notre institution. Un de nos conseillers vous contactera.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="level">Niveau d'étude souhaité</Label>
              <Select onValueChange={setLevel} value={level} required>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Sélectionner un niveau..." />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="field">Filière d'Intérêt</Label>
              <Select onValueChange={setFieldOfInterest} value={fieldOfInterest} required>
                <SelectTrigger id="field">
                  <SelectValue placeholder="Sélectionner une filière..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Soumettre ma demande
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
