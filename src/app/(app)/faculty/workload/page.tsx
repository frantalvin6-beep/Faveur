
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { TeacherWorkload, getTeacherWorkloads, addTeacherWorkload, deleteTeacherWorkload } from '@/lib/data';
import { TeacherWorkloadTable } from '@/components/faculty/teacher-workload-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TeacherWorkloadPage() {
  const router = useRouter();
  const [workloadData, setWorkloadData] = React.useState<TeacherWorkload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchWorkloads = React.useCallback(async () => {
    try {
        setLoading(true);
        const data = await getTeacherWorkloads();
        setWorkloadData(data);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
    } finally {
        setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchWorkloads();
  }, [fetchWorkloads]);
  
  const handleAddWorkload = async (workload: Omit<TeacherWorkload, 'id'>) => {
    if (workloadData.some(w => w.teacherId === workload.teacherId && w.courseName === workload.courseName)) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Une charge horaire pour cet enseignant et ce cours existe déjà.' });
        return;
    }

    try {
        await addTeacherWorkload(workload);
        toast({ title: 'Charge horaire ajoutée' });
        await fetchWorkloads(); // Refetch
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la charge horaire.' });
    }
  };
  
  const handleDeleteWorkload = async (id: string) => {
      if(confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
          try {
              await deleteTeacherWorkload(id);
              toast({ title: 'Charge horaire supprimée' });
              await fetchWorkloads(); // Refetch
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
        <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Charge horaire des enseignants</h1>
                <p className="text-muted-foreground">
                    Suivi des heures de cours prévues et effectuées par chaque enseignant.
                </p>
            </div>
        </div>
      <TeacherWorkloadTable 
        data={workloadData} 
        onAddWorkload={handleAddWorkload}
        onDeleteWorkload={handleDeleteWorkload}
      />
    </div>
  );
}
