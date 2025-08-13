
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Briefcase, Building, DollarSign, GraduationCap, UserCheck, UserCog } from 'lucide-react';
import type { UserRole } from '@/context/auth-context';

interface RoleInfo {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const roles: RoleInfo[] = [
    { role: 'Promoteur', title: 'Promoteur', description: 'Accès complet à toutes les fonctionnalités de gestion et de configuration.', icon: UserCog, href: '/login?role=Promoteur' },
    { role: 'DAC', title: 'Directeur Académique', description: 'Gère les facultés, cours, enseignants et résultats académiques.', icon: GraduationCap, href: '/login?role=DAC' },
    { role: 'DAF', title: 'Directeur Financier', description: 'Supervise la comptabilité, les frais de scolarité et les salaires.', icon: DollarSign, href: '/login?role=DAF' },
    { role: 'Secrétaire', title: 'Secrétaire', description: 'Gère les dossiers étudiants et le calendrier académique.', icon: Briefcase, href: '/login?role=Secrétaire' },
    { role: 'Surveillant', title: 'Surveillant', description: 'Contrôle la présence des étudiants et des enseignants.', icon: UserCheck, href: '/login?role=Surveillant' },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Bienvenue sur S.G.ENIA 2.0</h1>
          <p className="text-lg text-muted-foreground mt-2">Veuillez sélectionner votre portail de connexion.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {roles.map((info) => (
          <Card key={info.role} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="p-3 bg-primary/10 rounded-full">
                    <info.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>{info.title}</CardTitle>
                    <CardDescription className="pt-1">{info.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={info.href} passHref className="w-full">
                <Button className="w-full">Se connecter</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
