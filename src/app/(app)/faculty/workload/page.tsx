import { teacherWorkload } from '@/lib/data';
import { TeacherWorkloadTable } from '@/components/faculty/teacher-workload-table';

export default function TeacherWorkloadPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Charge horaire des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi des heures de cours prévues et effectuées par chaque enseignant.
      </p>
      <TeacherWorkloadTable data={teacherWorkload} />
    </div>
  );
}
