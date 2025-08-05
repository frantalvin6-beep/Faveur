import { examSchedule } from '@/lib/data';
import { ExamsPlanningTable } from '@/components/exams/exams-planning-table';

export default function ExamsPlanningPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Planification des examens</h1>
      <p className="text-muted-foreground mb-4">
        Organisez le calendrier des examens pour tous les départements.
      </p>
      <ExamsPlanningTable data={examSchedule} />
    </div>
  );
}
