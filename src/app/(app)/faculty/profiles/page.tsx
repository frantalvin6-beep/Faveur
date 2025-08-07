
'use client';

import * as React from 'react';
import { getFaculty, addFaculty, deleteFaculty, Faculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function FacultyProfilesPage() {
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const facultyData = await getFaculty();
        setFaculty(facultyData);
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger le personnel.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const handleAddFaculty = async (newFacultyMember: Omit<Faculty, 'id'>) => {
    try {
      const addedFaculty = await addFaculty(newFacultyMember);
      setFaculty(prev => [...prev, addedFaculty]);
      toast({ title: 'Membre ajouté', description: `Le membre du personnel ${addedFaculty.name} a été ajouté.` });
    } catch (error) {
      console.error("Failed to add faculty:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter le membre du personnel.' });
    }
  };
  
  const handleDeleteFaculty = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
          try {
              await deleteFaculty(id);
              setFaculty(prev => prev.filter(f => f.id !== id));
              toast({ title: 'Membre supprimé' });
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
