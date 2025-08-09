
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Bienvenue sur Campus Central</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Votre solution intégrée pour la gestion universitaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Simplifiez la gestion des étudiants, du personnel, des finances et des aspects académiques avec une plateforme centralisée et performante.
          </p>
          <Link href="/login" passHref>
            <Button size="lg">
              Accéder au portail d'administration
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
