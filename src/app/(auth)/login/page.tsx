
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, UserRole } from '@/context/auth-context';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserRole } = useAuth();
  
  const role = searchParams.get('role') as UserRole | null;

  // If no role is provided, redirect to home to select one
  useEffect(() => {
    if (!role) {
      router.push('/');
    }
  }, [role, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      setUserRole(role);
      
      // Redirect based on role
      switch (role) {
        case 'DAF':
          router.push('/finances');
          break;
        case 'DAC':
          router.push('/academics');
          break;
        case 'Surveillant':
          router.push('/students/attendance');
          break;
        case 'Professeur':
          router.push('/exams/grades');
          break;
        case 'Étudiant':
          router.push('/exams/results');
          break;
        case 'Promoteur':
        case 'Secrétaire':
        default:
          router.push('/dashboard');
          break;
      }
    }
  };

  if (!role) {
      // You can show a loading state or a message here
      return <div className="flex min-h-screen items-center justify-center bg-background p-4">Redirection...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connexion : {role}</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre espace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@campuscentral.com" required defaultValue="admin@campuscentral.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full">
              Connexion
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
            Nouveau ici ?{' '}
            <Link href={`/register?role=${role}`} className="underline">
              Créer un compte
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
            <Link href="/" className="underline text-muted-foreground">
              Changer de portail
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
