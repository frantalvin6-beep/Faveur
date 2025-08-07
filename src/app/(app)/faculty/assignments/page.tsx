
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CourseAssignment, getCourseAssignments, addCourseAssignment, deleteCourseAssignment } from '@/lib/data';
import { CourseAssignmentsTable } from '@/components/faculty/course-assignments-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = React.useState<CourseAssignment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCourseAssignments();
        setAssignments(data);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les attributions.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);
  
  const handleAddAssignment = async (assignment: Omit<CourseAssignment, 'id'>) => {
    try {
        const newAssignment = await addCourseAssignment(assignment);
        setAssignments(prev => [...prev, newAssignment]);
        toast({ title: 'Attribution ajoutée' });
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'attribution.' });
    }
  };
  
  const handleDeleteAssignment = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette attribution ?')) {
          try {
              await deleteCourseAssignment(id);
              setAssignments(prev => prev.filter(a => a.id !== id));
              toast({ title: 'Attribution supprimée' });
          } catch (error) {
              console.error(error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'attribution.' });
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
            <h1 className="text-3xl font-bold">Attribution des cours</h1>
        </div>
        <CourseAssignmentsTable 
            data={assignments} 
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
        />
    </div>
  )
}
