
import * as React from 'react';
import { getTeacherAttendance } from '@/lib/data';
import { AttendanceTable } from '@/components/faculty/attendance-table';

export default async function AttendancePage() {
  const attendanceData = await getTeacherAttendance();
  const sortedAttendance = attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1 className="text-3xl font-bold">Feuille de présence des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi de la présence des enseignants aux cours planifiés. La charge horaire est mise à jour automatiquement.
      </p>
      <AttendanceTable initialData={sortedAttendance} />
    </div>
  );
}
