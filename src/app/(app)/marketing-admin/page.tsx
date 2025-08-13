
'use client';

import * as React from 'react';
import {
  getMarketingContent,
  addMarketingContent,
  deleteMarketingContent,
  MarketingContent,
  getPreRegistrations,
  PreRegistration,
  validatePreRegistration,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function AddPublicationForm({ onAdd }: { onAdd: (data: Omit<MarketingContent, 'id'>) => Promise<void> }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState('');
    const [imageHint, setImageHint] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onAdd({ title, description, image, imageHint });
        setLoading(false);
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setImage('');
        setImageHint('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une publication
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle Publication</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="image">URL de l'image</Label>
                        <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://placehold.co/600x400.png" />
                    </div>
                     <div>
                        <Label htmlFor="imageHint">Indice pour l'image (IA)</Label>
                        <Input id="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} placeholder="Ex: university students" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={loading}>Annuler</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function PreRegistrationTable({ registrations, onValidate, onDelete }: { registrations: PreRegistration[], onValidate: (id: string) => void, onDelete: (id: string) => void }) {
  const [validatingId, setValidatingId] = React.useState<string | null>(null);

  const handleValidate = async (id: string) => {
    setValidatingId(id);
    await onValidate(id);
    setValidatingId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pré-inscriptions en attente</CardTitle>
        <CardDescription>Validez les demandes pour inscrire officiellement les étudiants.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.length > 0 ? registrations.map(reg => (
                <TableRow key={reg.id}>
                  <TableCell>{new Date(reg.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{reg.name}</TableCell>
                  <TableCell>
                    <div>{reg.email}</div>
                    <div className="text-xs text-muted-foreground">{reg.phone}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{reg.level}</Badge></TableCell>
                  <TableCell><Badge variant="secondary">{reg.fieldOfInterest}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button size="sm" variant="outline" onClick={() => handleValidate(reg.id)} disabled={validatingId === reg.id}>
                       {validatingId === reg.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                       Valider
                     </Button>
                     <Button size="sm" variant="destructive" onClick={() => onDelete(reg.id)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Aucune pré-inscription en attente.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MarketingAdminPage() {
    const [publications, setPublications] = React.useState<MarketingContent[]>([]);
    const [registrations, setRegistrations] = React.useState<PreRegistration[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchData = React.useCallback(async () => {
        try {
            const [pubData, regData] = await Promise.all([getMarketingContent(), getPreRegistrations()]);
            setPublications(pubData);
            setRegistrations(regData.filter(r => r.status === 'En attente'));
        } catch (error) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible de charger les données marketing."});
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddPublication = async (data: Omit<MarketingContent, 'id'>) => {
        try {
            await addMarketingContent(data);
            toast({ title: "Publication ajoutée" });
            fetchData();
        } catch(e) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible d'ajouter la publication."});
        }
    };
    
    const handleDeletePublication = async (id: string) => {
       if (confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
         try {
            await deleteMarketingContent(id);
            toast({ title: "Publication supprimée" });
            fetchData();
        } catch(e) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible de supprimer la publication."});
        }
       }
    };

    const handleValidateRegistration = async (id: string) => {
      try {
        await validatePreRegistration(id);
        toast({ title: "Étudiant validé !", description: "L'étudiant a été ajouté à la liste officielle."});
        fetchData();
      } catch (e) {
        toast({ variant: 'destructive', title: "Erreur de validation", description: (e as Error).message });
      }
    };

    const handleDeleteRegistration = (id: string) => {
      // For now, we don't implement deletion from admin panel to avoid accidental data loss.
      toast({ title: "Action non disponible", description: "La suppression des pré-inscriptions sera bientôt disponible." });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gestion des Publications</CardTitle>
                        <CardDescription>Gérez le contenu affiché sur la page marketing publique.</CardDescription>
                    </div>
                    <AddPublicationForm onAdd={handleAddPublication} />
                </CardHeader>
                <CardContent>
                    {publications.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publications.map(pub => (
                                <Card key={pub.id} className="group relative">
                                    <Image src={pub.image || "https://placehold.co/600x400.png"} alt={pub.title} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" />
                                    <CardHeader>
                                        <CardTitle>{pub.title}</CardTitle>
                                        <CardDescription>{pub.description}</CardDescription>
                                    </CardHeader>
                                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeletePublication(pub.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">Aucune publication. Ajoutez-en une pour commencer.</p>
                    )}
                </CardContent>
            </Card>

            <PreRegistrationTable 
              registrations={registrations} 
              onValidate={handleValidateRegistration}
              onDelete={handleDeleteRegistration}
            />
        </div>
    )
}
