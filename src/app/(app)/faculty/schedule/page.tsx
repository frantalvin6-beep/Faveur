import { scheduleData } from '@/lib/data';
import { ScheduleTable } from '@/components/faculty/schedule-table';

export default function FacultySchedulePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Emploi du temps du personnel</h1>
        <p className="text-muted-foreground">
          Consultez et gérez les emplois du temps des enseignants.
        </p>
      </div>
      <ScheduleTable data={scheduleData} />
    </div>
  );
}
