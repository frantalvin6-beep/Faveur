
'use client';

import * as React from 'react';
import { getAdminStaff, addAdminStaff, deleteAdminStaff, updateAdminStaff, AdminStaff } from '@/lib/data';
import { AdminStaffTable } from '@/components/administration/admin-staff-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function AdminStaffPage() {
  const [staff, setStaff] = React.useState<AdminStaff[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchStaff = React.useCallback(async () => {
    try {
      setLoading(true);
      const staffData = await getAdminStaff();
      setStaff(staffData);
    } catch (error) {
      console.error("Failed to fetch admin staff data:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données du personnel.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddStaff = async (newStaffMember: Omit<AdminStaff, 'id'>) => {
    try {
      const addedStaff = await addAdminStaff(newStaffMember);
      toast({ title: 'Membre ajouté', description: `Le membre du personnel ${addedStaff.name} a été ajouté.` });
      await fetchStaff(); // Refetch
      return addedStaff;
    } catch (error) {
      console.error("Failed to add staff:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter le membre du personnel.' });
      throw error;
    }
  };
  
  const handleDeleteStaff = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?')) {
          try {
              await deleteAdminStaff(id);
              toast({ title: 'Membre supprimé' });
              await fetchStaff(); // Refetch
          } catch (error) {
              console.error("Failed to delete staff:", error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le membre.' });
          }
      }
  };

  const handleUpdateStaff = async (id: string, data: Partial<AdminStaff>) => {
    try {
        await updateAdminStaff(id, data);
        toast({ title: 'Membre mis à jour' });
        await fetchStaff(); // Refetch
    } catch (error) {
        console.error("Failed to update staff:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour le membre.' });
    }
  };


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
        <h1 className="text-3xl font-bold">Personnel Administratif</h1>
        <p className="text-muted-foreground mb-4">
          Gérez les comptes et les informations du personnel non-enseignant de l'université.
        </p>
        <AdminStaffTable 
            data={staff} 
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
        />
    </div>
  )
}
