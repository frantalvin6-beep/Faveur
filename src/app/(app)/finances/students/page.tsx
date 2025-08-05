import { studentFinances } from '@/lib/data';
import { StudentFinancesTable } from '@/components/finances/student-finances-table';

export default function StudentFinancesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Finances des Étudiants</h1>
        <p className="text-muted-foreground">
          Suivez et gérez les frais de scolarité et les paiements des étudiants.
        </p>
      </div>
      <StudentFinancesTable initialData={studentFinances} />
    </div>
  );
}
