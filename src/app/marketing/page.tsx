
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, GraduationCap, Video } from 'lucide-react';
import { PreRegistrationForm } from '@/components/marketing/pre-registration-form';
import { getMarketingContent, MarketingContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

function HeroSection() {
    return (
        <section className="relative h-[60vh] flex items-center justify-center text-white text-center p-4">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <Image 
                src="https://placehold.co/1920x1080.png" 
                data-ai-hint="university campus" 
                alt="Campus universitaire" 
                layout="fill" 
                objectFit="cover" 
                className="z-0" 
            />
            <div className="relative z-20 space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Votre Avenir Commence Ici</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                    Découvrez une éducation d'excellence conçue pour les leaders de demain.
                </p>
                <Button size="lg" asChild>
                    <a href="#pre-inscription">
                        Commencer ma pré-inscription <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                </Button>
            </div>
        </section>
    );
}

function PublicationCard({ title, description, image, imageHint }: MarketingContent) {
  return (
    <Card className="overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative h-56 w-full">
        <Image src={image || "https://placehold.co/600x400.png"} alt={title} layout="fill" objectFit="cover" data-ai-hint={imageHint} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         <CardTitle className="absolute bottom-4 left-4 text-white text-2xl">{title}</CardTitle>
      </div>
      <CardContent className="pt-6 flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function MarketingPage() {
    const [publications, setPublications] = React.useState<MarketingContent[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const content = await getMarketingContent();
                setPublications(content);
            } catch (error) {
                console.error("Failed to fetch marketing content", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

  return (
    <div className="space-y-20">
      <HeroSection />

      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-8 text-center">Nos dernières actualités</h2>
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        ) : publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.map((pub) => (
                <PublicationCard key={pub.id} {...pub} />
              ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">Aucune publication pour le moment.</p>
        )}
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
             <div>
                <h2 className="text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
                <p className="text-lg text-muted-foreground mb-6">Nous offrons un environnement d'apprentissage stimulant, des programmes pertinents pour l'industrie et un corps professoral dévoué à votre réussite.</p>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-full"><GraduationCap className="h-6 w-6"/></div>
                        <div>
                            <h3 className="font-semibold text-xl">Programmes de Pointe</h3>
                            <p className="text-muted-foreground">Des cursus conçus pour répondre aux défis du monde moderne.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-full"><BookOpen className="h-6 w-6"/></div>
                        <div>
                            <h3 className="font-semibold text-xl">Recherche Innovante</h3>
                            <p className="text-muted-foreground">Contribuez à des projets qui façonnent l'avenir de la technologie.</p>
                        </div>
                    </div>
                </div>
             </div>
             <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
                 <Image src="https://placehold.co/600x400.png" data-ai-hint="students collaborating" alt="Étudiants collaborant" layout="fill" objectFit="cover" />
             </div>
        </div>
      </section>

      <section id="pre-inscription" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Prêt à nous rejoindre ?</h2>
        <PreRegistrationForm />
      </section>
    </div>
  );
}
