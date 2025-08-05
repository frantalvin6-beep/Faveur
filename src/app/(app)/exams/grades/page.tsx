import { GradesTable } from '@/components/exams/grades-table';
import { examGrades } from '@/lib/data';

export default function GradesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Saisie et consultation des notes</h1>
        <p className="text-muted-foreground">
            Gérez les notes des étudiants pour chaque évaluation.
        </p>
      </div>
      <GradesTable data={examGrades} />
    </div>
  );
}
