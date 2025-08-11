
'use client';

import * as React from 'react';
import { TeacherWorkload, getTeacherWorkloads, addTeacherWorkload, deleteTeacherWorkload } from '@/lib/data';
import { TeacherWorkloadTable } from '@/components/faculty/teacher-workload-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherWorkloadPage() {
  const [workloadData, setWorkloadData] = React.useState<TeacherWorkload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            const data = await getTeacherWorkloads();
            setWorkloadData(data);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);
  
  const handleAddWorkload = async (workload: Omit<TeacherWorkload, 'id'>) => {
    // Check if a workload for this teacher and course already exists
    if (workloadData.some(w => w.teacherId === workload.teacherId && w.courseName === workload.courseName)) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Une charge horaire pour cet enseignant et ce cours existe déjà.' });
        return;
    }

    try {
        const newWorkload = await addTeacherWorkload(workload);
        setWorkloadData(prev => [...prev, newWorkload]);
        toast({ title: 'Charge horaire ajoutée' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la charge horaire.' });
    }
  };
  
  const handleDeleteWorkload = async (id: string) => {
      if(confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
          try {
              await deleteTeacherWorkload(id);
              setWorkloadData(prev => prev.filter(w => w.id !== id));
              toast({ title: 'Charge horaire supprimée' });
          } catch(error) {
              console.error(error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la charge horaire.' });
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
      <h1 className="text-3xl font-bold">Charge horaire des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi des heures de cours prévues et effectuées par chaque enseignant.
      </p>
      <TeacherWorkloadTable 
        data={workloadData} 
        onAddWorkload={handleAddWorkload}
        onDeleteWorkload={handleDeleteWorkload}
      />
    </div>
  );
}
