
'use client';

import * as React from 'react';
import { getTeacherAttendance, addTeacherAttendance, deleteTeacherAttendance, TeacherAttendance } from '@/lib/data';
import { AttendanceTable } from '@/components/faculty/attendance-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttendancePage() {
  const [attendance, setAttendance] = React.useState<TeacherAttendance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const attendanceData = await getTeacherAttendance();
            setAttendance(attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les présences.' });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);


  const handleAddEntry = async (newEntryData: Omit<TeacherAttendance, 'id'>) => {
    try {
        const newEntry = await addTeacherAttendance(newEntryData);
        setAttendance(prev => [newEntry, ...prev]);
        toast({ title: 'Présence enregistrée' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'enregistrer la présence.' });
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      try {
          await deleteTeacherAttendance(id);
          setAttendance(prev => prev.filter(a => a.id !== id));
          toast({ title: 'Entrée supprimée' });
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'entrée.' });
      }
    }
  };
  
  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-80 w-full" />
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Feuille de présence des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi de la présence des enseignants aux cours planifiés. La charge horaire est mise à jour automatiquement.
      </p>
      <AttendanceTable data={attendance} onAddEntry={handleAddEntry} onDeleteEntry={handleDeleteEntry} />
    </div>
  );
}
