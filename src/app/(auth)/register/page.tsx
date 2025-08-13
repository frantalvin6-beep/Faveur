
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole } from '@/context/auth-context';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  
  const role = searchParams.get('role') as UserRole | null;

  // If no role is provided, redirect to home to select one
  useEffect(() => {
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the registration data to your backend
    // For this demo, we'll just simulate a successful submission
    setSubmitted(true);
  };

  if (!role) {
      return <div className="flex min-h-screen items-center justify-center bg-background p-4">Redirection...</div>;
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
              <Label htmlFor="name">Nom Complet</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Demander la création du compte
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
