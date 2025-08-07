
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/data';
import { Loader2, Database } from 'lucide-react';

export default function SeedDataPage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const { toast } = useToast();

    const handleSeed = async () => {
        setIsLoading(true);
        try {
            await seedDatabase();
            toast({
                title: 'Succès !',
                description: 'Votre base de données a été peuplée avec les données d\'exemple.',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Une erreur est survenue lors du peuplement de la base de données.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Peuplement de la base de données</CardTitle>
                    <CardDescription>
                        Cliquez sur le bouton ci-dessous pour initialiser votre base de données Firestore avec les données d'exemple.
                        Cette action est généralement nécessaire une seule fois.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                        <Database className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Prêt à remplir votre base de données Firestore ?
                        </p>
                        <Button onClick={handleSeed} disabled={isLoading} size="lg">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>En cours...</span>
                                </>
                            ) : (
                                <span>Peupler la base de données</span>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
