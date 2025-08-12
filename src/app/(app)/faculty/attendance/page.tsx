
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getTeacherAttendance } from '@/lib/data';
import { AttendanceTable } from '@/components/faculty/attendance-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AttendancePage() {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeacherAttendance();
        const sortedAttendance = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAttendanceData(sortedAttendance);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center gap-4 mb-4">
             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Feuille de présence des enseignants</h1>
                <p className="text-muted-foreground">
                    Suivi de la présence des enseignants aux cours planifiés. La charge horaire est mise à jour automatiquement.
                </p>
            </div>
        </div>
      <AttendanceTable initialData={attendanceData} />
    </div>
  );
}
