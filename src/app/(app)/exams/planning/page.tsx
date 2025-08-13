
'use client';

import * as React from 'react';
import { getExamSchedules, addExamSchedule, deleteExamSchedule, ExamSchedule } from '@/lib/data';
import { ExamsPlanningTable } from '@/components/exams/exams-planning-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function ExamsPlanningPage() {
  const [schedule, setSchedule] = React.useState<ExamSchedule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  
  const fetchData = React.useCallback(async () => {
    try {
        setLoading(true);
        const scheduleData = await getExamSchedules();
        const sortedData = scheduleData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSchedule(sortedData);
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le planning des examens.' });
    } finally {
        setLoading(false);
    }
  }, [toast]);
  
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddExam = async (exam: Omit<ExamSchedule, 'id'>) => {
    try {
        await addExamSchedule(exam);
        toast({ title: 'Examen planifié', description: `L'examen de ${exam.courseName} a été ajouté au planning.` });
        await fetchData();
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de planifier l\'examen.' });
        throw error;
    }
  }

  const handleDeleteExam = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
        try {
            await deleteExamSchedule(id);
            toast({ title: 'Planification supprimée' });
            await fetchData();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la planification.' });
        }
      }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-96 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Planification des examens</h1>
      <p className="text-muted-foreground mb-4">
        Organisez le calendrier des examens pour tous les départements.
      </p>
      <ExamsPlanningTable data={schedule} onAdd={handleAddExam} onDelete={handleDeleteExam} />
    </div>
  );
}
