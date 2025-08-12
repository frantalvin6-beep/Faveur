
'use client';

import * as React from 'react';
import { getFaculty, addFaculty, deleteFaculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Faculty } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function FacultyProfilesPage() {
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchFaculty = React.useCallback(async () => {
    try {
      setLoading(true);
      const facultyData = await getFaculty();
      setFaculty(facultyData);
    } catch (error) {
      console.error("Failed to fetch faculty data:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données du personnel.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  const handleAddFaculty = async (newFacultyMember: Omit<Faculty, 'id'>) => {
    try {
      const addedFaculty = await addFaculty(newFacultyMember);
      toast({ title: 'Membre ajouté', description: `Le membre du personnel ${addedFaculty.name} a été ajouté.` });
      await fetchFaculty(); // Refetch
    } catch (error) {
      console.error("Failed to add faculty:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter le membre du personnel.' });
      throw error;
    }
  };
  
  const handleDeleteFaculty = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
          try {
              await deleteFaculty(id);
              toast({ title: 'Membre supprimé' });
              await fetchFaculty(); // Refetch
          } catch (error) {
              console.error("Failed to delete faculty:", error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le membre.' });
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
        <h1 className="text-3xl font-bold mb-4">Profils du Personnel Enseignant</h1>
        <FacultyTable 
            data={faculty} 
            onAddFaculty={handleAddFaculty}
            onDeleteFaculty={handleDeleteFaculty}
        />
    </div>
  )
}
