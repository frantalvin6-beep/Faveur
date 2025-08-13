
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Video } from 'lucide-react';
import { PreRegistrationForm } from '@/components/marketing/pre-registration-form';

const publications = [
  {
    title: "Journée Portes Ouvertes 2024",
    description: "Découvrez nos campus, rencontrez nos enseignants et explorez nos programmes innovants. Une journée pour construire votre avenir.",
    image: "https://placehold.co/600x400.png",
    imageHint: "university open day",
    link: "#"
  },
  {
    title: "Nouveau Master en Cybersécurité",
    description: "Face à la demande croissante, nous lançons un programme de Master de pointe pour former les experts en cybersécurité de demain.",
    image: "https://placehold.co/600x400.png",
    imageHint: "cybersecurity computer",
    link: "#"
  },
  {
    title: "Conférence sur l'IA et l'Éthique",
    description: "Rejoignez notre débat avec des experts de premier plan sur les implications éthiques de l'intelligence artificielle.",
    image: "https://placehold.co/600x400.png",
    imageHint: "AI ethics",
    link: "#"
  }
];

const videos = [
  {
    title: "Visite virtuelle du campus",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    poster: "https://placehold.co/1920x1080.png",
    posterHint: "university campus tour"
  },
  {
    title: "Témoignages d'étudiants",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    poster: "https://placehold.co/1920x1080.png",
    posterHint: "students talking"
  }
];

function PublicationCard({ title, description, image, imageHint, link }: typeof publications[0]) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} layout="fill" objectFit="cover" data-ai-hint={imageHint} />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline">
          <a href={link}>
            En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function VideoPlayer({ title, src, poster, posterHint }: typeof videos[0]) {
  return (
    <div className="space-y-2">
       <CardTitle className="text-xl flex items-center gap-2"><Video className="h-5 w-5"/> {title}</CardTitle>
      <video
        controls
        poster={poster}
        data-ai-hint={posterHint}
        className="w-full aspect-video rounded-lg"
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  );
}


export default function MarketingPage() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-semibold mb-6">Publications & Événements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((pub, index) => (
            <PublicationCard key={index} {...pub} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Galerie Vidéo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
                <VideoPlayer key={index} {...video} />
            ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Pré-inscriptions</h2>
        <PreRegistrationForm />
      </section>
    </div>
  );
}
