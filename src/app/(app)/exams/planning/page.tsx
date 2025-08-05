import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExamsPlanningPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Planification des examens</h1>
      <p className="text-muted-foreground mb-4">
        Organisez le calendrier des examens pour tous les départements.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Bientôt disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            L'outil de planification visuelle des examens est en cours de développement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
