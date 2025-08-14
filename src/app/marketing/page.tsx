
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, BookOpen, Clapperboard, GraduationCap } from 'lucide-react';
import { PreRegistrationForm } from '@/components/marketing/pre-registration-form';
import { getMarketingContent, MarketingContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function HeroSection() {
    return (
        <section className="relative h-[60vh] flex items-center justify-center text-white text-center p-4">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <Image 
                src="https://placehold.co/1920x1080.png" 
                data-ai-hint="university campus modern" 
                alt="Campus universitaire moderne" 
                layout="fill" 
                objectFit="cover" 
                className="z-0"
                priority
            />
            <div className="relative z-20 space-y-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-2xl">L'Excellence Éducative, Votre Avenir Assuré</h1>
                <p className="text-lg md:text-xl text-white/90">
                    Découvrez des programmes innovants, un corps professoral d'exception et un environnement qui cultive le succès.
                </p>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
    <Card className="overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-56 w-full">
        <Image src={image || "https://placehold.co/600x400.png"} alt={title} layout="fill" objectFit="cover" data-ai-hint={imageHint} className="transition-transform duration-500 group-hover:scale-110" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
         <CardTitle className="absolute bottom-4 left-4 text-white text-2xl drop-shadow-md">{title}</CardTitle>
      </div>
      <CardContent className="p-6 flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function VideoCard({ title, description, videoUrl }: MarketingContent) {
    const embedUrl = videoUrl?.includes('youtube.com') 
        ? `https://www.youtube.com/embed/${new URL(videoUrl).searchParams.get('v')}`
        : videoUrl; // Add more providers if needed

    return (
        <Card className="overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative h-56 w-full bg-black">
                {embedUrl ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full bg-muted">
                        <Clapperboard className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
            <CardHeader className="p-6">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}


export default function MarketingPage() {
    const [content, setContent] = React.useState<MarketingContent[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const fetchedContent = await getMarketingContent();
                setContent(fetchedContent);
            } catch (error) {
                console.error("Failed to fetch marketing content", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const articles = content.filter(c => c.type === 'article');
    const videos = content.filter(c => c.type === 'video');

  return (
    <div className="space-y-24 pb-12">
      <HeroSection />

      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <Badge variant="secondary" className="text-lg px-4 py-1">Actualités</Badge>
            <h2 className="text-4xl font-bold mt-2">Nos dernières publications</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Restez informé des derniers événements, innovations et réussites de notre institution.</p>
        </div>
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((item) => (
                <PublicationCard key={item.id} {...item} />
              ))}
            </div>
        ) : (
            <p className="text-center text-muted-foreground py-8">Aucune publication pour le moment.</p>
        )}
      </section>
      
      {videos.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="text-center mb-12">
                <Badge variant="secondary" className="text-lg px-4 py-1">Vidéos</Badge>
                <h2 className="text-4xl font-bold mt-2">Découvrez notre campus en vidéo</h2>
                 <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Plongez dans l'expérience de notre campus à travers ces courtes vidéos.</p>
            </div>
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videos.map((item) => (
                    <VideoCard key={item.id} {...item} />
                  ))}
                </div>
            )}
          </section>
      )}

      <section className="bg-muted py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
             <div>
                <h2 className="text-4xl font-bold mb-4">Pourquoi Nous Choisir ?</h2>
                <p className="text-lg text-muted-foreground mb-8">Nous offrons un environnement d'apprentissage stimulant, des programmes pertinents pour l'industrie et un corps professoral dévoué à votre réussite.</p>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"><GraduationCap className="h-6 w-6"/></div>
                        <div>
                            <h3 className="font-semibold text-xl">Programmes de Pointe</h3>
                            <p className="text-muted-foreground">Des cursus conçus pour répondre aux défis du monde moderne.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="flex-shrink-0 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"><BookOpen className="h-6 w-6"/></div>
                        <div>
                            <h3 className="font-semibold text-xl">Recherche Innovante</h3>
                            <p className="text-muted-foreground">Contribuez à des projets qui façonnent l'avenir de la technologie.</p>
                        </div>
                    </div>
                </div>
             </div>
             <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl group">
                 <Image src="https://placehold.co/600x400.png" data-ai-hint="students collaborating learning" alt="Étudiants collaborant" layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110"/>
                 <div className="absolute inset-0 bg-black/10"></div>
             </div>
        </div>
      </section>

      <section id="pre-inscription" className="container mx-auto px-4 py-16">
        <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">Prêt à nous rejoindre ?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Remplissez ce formulaire en quelques minutes pour démarrer votre parcours avec nous.</p>
        </div>
        <PreRegistrationForm />
      </section>
    </div>
  );
}
