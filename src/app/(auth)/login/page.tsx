'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  // La logique de redirection est maintenant gérée par le lien sur le bouton.
  // Cela est plus fiable que la navigation programmatique pour ce cas simple.

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Portail d'Administration</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à S.G.ENIA 2.0.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@campuscentral.com" required defaultValue="admin@campuscentral.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Link href="/dashboard" passHref>
              <Button type="submit" className="w-full">
                Connexion
              </Button>
            </Link>
          </form>
           <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline">
              Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
