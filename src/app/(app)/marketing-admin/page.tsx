
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
import { PlusCircle, Trash2, CheckCircle, Loader2, Clapperboard, Newspaper, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateArticle } from '@/ai/flows/generate-article-flow';


function AddContentForm({ onAdd, type }: { onAdd: (data: Omit<MarketingContent, 'id'>) => Promise<void>, type: 'article' | 'video' }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [imageHint, setImageHint] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    
    // AI Generation State
    const [aiTopic, setAiTopic] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);

    const isArticle = type === 'article';
    const dialogTitle = isArticle ? 'Nouvel Article' : 'Nouvelle Vidéo';
    const urlLabel = isArticle ? "URL de l'image" : "URL de la vidéo (YouTube, etc.)";
    const urlPlaceholder = isArticle ? "https://placehold.co/600x400.png" : "https://www.youtube.com/watch?v=...";

    const { toast } = useToast();

    const handleGenerateArticle = async () => {
        if (!aiTopic) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez entrer un sujet pour la génération IA.' });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateArticle({ topic: aiTopic });
            if (result) {
                setTitle(result.title);
                setDescription(result.description);
                setImageHint(result.imageHint);
                toast({ title: 'Article généré !', description: 'Le titre, la description et l\'indice d\'image ont été remplis.' });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur de génération', description: 'Impossible de générer l\'article.' });
        } finally {
            setIsGenerating(false);
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const contentData: Omit<MarketingContent, 'id'> = {
            title,
            description,
            type,
            ...(isArticle ? { image: url, imageHint } : { videoUrl: url }),
        };
        await onAdd(contentData);
        setLoading(false);
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setUrl('');
        setImageHint('');
        setAiTopic('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> {isArticle ? 'Ajouter un article' : 'Ajouter une vidéo'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isArticle && (
                        <Card className="bg-muted/50">
                            <CardHeader className="pb-4">
                               <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Générateur d'Article IA</CardTitle>
                               <CardDescription>Entrez un sujet et laissez l'IA créer un brouillon pour vous.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-end gap-2">
                                <div className="flex-grow space-y-1">
                                    <Label htmlFor="ai-topic">Sujet de l'article</Label>
                                    <Input id="ai-topic" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Ex: Journée portes ouvertes de l'université" />
                                </div>
                                <Button type="button" onClick={handleGenerateArticle} disabled={isGenerating}>
                                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Générer
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="url">{urlLabel}</Label>
                        <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={urlPlaceholder} required />
                    </div>
                     {isArticle && (
                         <div>
                            <Label htmlFor="imageHint">Indice pour l'image (IA)</Label>
                            <Input id="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} placeholder="Ex: university students" />
                        </div>
                     )}
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
    const [content, setContent] = React.useState<MarketingContent[]>([]);
    const [registrations, setRegistrations] = React.useState<PreRegistration[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const articles = content.filter(c => c.type === 'article');
    const videos = content.filter(c => c.type === 'video');

    const fetchData = React.useCallback(async () => {
        try {
            const [contentData, regData] = await Promise.all([getMarketingContent(), getPreRegistrations()]);
            setContent(contentData);
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

    const handleAddContent = async (data: Omit<MarketingContent, 'id'>) => {
        try {
            await addMarketingContent(data);
            toast({ title: "Contenu ajouté avec succès" });
            fetchData();
        } catch(e) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible d'ajouter le contenu."});
        }
    };
    
    const handleDeleteContent = async (id: string) => {
       if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
         try {
            await deleteMarketingContent(id);
            toast({ title: "Contenu supprimé" });
            fetchData();
        } catch(e) {
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible de supprimer le contenu."});
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
                <CardHeader>
                    <CardTitle>Gestion du Contenu Marketing</CardTitle>
                    <CardDescription>Gérez le contenu affiché sur la page marketing publique.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="articles">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="articles"><Newspaper className="mr-2 h-4 w-4" />Articles & Publications</TabsTrigger>
                            <TabsTrigger value="videos"><Clapperboard className="mr-2 h-4 w-4" />Vidéos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="articles" className="mt-4">
                            <div className="text-right mb-4">
                                <AddContentForm onAdd={handleAddContent} type="article" />
                            </div>
                            {articles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {articles.map(pub => (
                                        <Card key={pub.id} className="group relative">
                                            <Image src={pub.image || "https://placehold.co/600x400.png"} alt={pub.title} width={600} height={400} className="rounded-t-lg object-cover h-48 w-full" data-ai-hint={pub.imageHint} />
                                            <CardHeader>
                                                <CardTitle>{pub.title}</CardTitle>
                                                <CardDescription>{pub.description}</CardDescription>
                                            </CardHeader>
                                            <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteContent(pub.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">Aucun article. Ajoutez-en un pour commencer.</p>
                            )}
                        </TabsContent>
                        <TabsContent value="videos" className="mt-4">
                             <div className="text-right mb-4">
                                <AddContentForm onAdd={handleAddContent} type="video" />
                            </div>
                             {videos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {videos.map(pub => (
                                        <Card key={pub.id} className="group relative">
                                            <div className="h-48 w-full bg-black rounded-t-lg flex items-center justify-center">
                                                <Clapperboard className="h-16 w-16 text-white"/>
                                            </div>
                                            <CardHeader>
                                                <CardTitle>{pub.title}</CardTitle>
                                                <CardDescription>{pub.description}</CardDescription>
                                            </CardHeader>
                                            <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteContent(pub.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">Aucune vidéo. Ajoutez-en une pour commencer.</p>
                            )}
                        </TabsContent>
                    </Tabs>
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

    