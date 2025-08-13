
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { getFaculty, getStudents } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const role = searchParams.get('role') as UserRole | null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // If no role is provided, redirect to home to select one
  useEffect(() => {
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if user exists in the database based on their role
    if (role === 'Professeur' || role === 'Étudiant') {
        let userExists = false;
        try {
            if (role === 'Professeur') {
                const faculty = await getFaculty();
                userExists = faculty.some(f => f.name.toLowerCase() === name.toLowerCase());
            } else if (role === 'Étudiant') {
                const students = await getStudents();
                userExists = students.some(s => s.name.toLowerCase() === name.toLowerCase());
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Erreur de vérification',
                description: 'Impossible de vérifier vos informations pour le moment. Veuillez réessayer plus tard.',
            });
            setIsLoading(false);
            return;
        }

        if (!userExists) {
            toast({
                variant: 'destructive',
                title: 'Utilisateur non trouvé',
                description: 'Votre nom n\'a pas été trouvé dans nos registres. Veuillez contacter l\'administration.',
            });
            setIsLoading(false);
            return;
        }
    }


    // Here you would typically send the registration data to your backend
    // For this demo, we'll just simulate a successful submission
    setSubmitted(true);
    setIsLoading(false);
  };

  if (!role) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  if (submitted) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Demande envoyée !</CardTitle>
                    <CardDescription>
                        Votre demande de création de compte a été envoyée. Un administrateur doit la valider avant que vous puissiez vous connecter.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push(`/login?role=${role}`)} className="w-full">
                        Retour à la connexion
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Créer un compte : {role}</CardTitle>
          <CardDescription>Remplissez le formulaire pour demander un accès.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom Complet (tel qu'enregistré)</Label>
              <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Vérification...' : 'Demander la création du compte'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Déjà un compte ?{' '}
            <Link href={`/login?role=${role}`} className="underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RegisterPageSkeleton() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center space-y-2">
                    <Skeleton className="h-7 w-48 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                </CardContent>
            </Card>
        </div>
    )
}


export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterPageSkeleton />}>
            <RegisterPageContent />
        </Suspense>
    )
}
