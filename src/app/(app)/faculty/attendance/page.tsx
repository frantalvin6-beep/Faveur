import { teacherAttendance } from '@/lib/data';
import { AttendanceTable } from '@/components/faculty/attendance-table';

export default function AttendancePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Feuille de présence des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi de la présence des enseignants aux cours planifiés.
      </p>
      <AttendanceTable data={teacherAttendance} />
    </div>
  );
}
