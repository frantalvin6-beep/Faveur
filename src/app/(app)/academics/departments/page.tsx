
'use client';

import * as React from 'react';
import { getDepartments, addDepartment, deleteDepartment, Department } from '@/lib/data';
import { DepartmentsTable } from '@/components/academics/departments-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function DepartmentsPage() {
    const [departments, setDepartments] = React.useState<Department[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        async function fetchData() {
            try {
                const departmentsData = await getDepartments();
                setDepartments(departmentsData);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les départements.' });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [toast]);

    const handleAddDepartment = async (deptData: Omit<Department, 'id'>) => {
        try {
            const newDepartment = await addDepartment(deptData);
            setDepartments(prev => [...prev, newDepartment]);
            toast({ title: 'Département ajouté', description: `Le département ${newDepartment.name} a été créé.` });
        } catch (error) {
            console.error("Failed to add department:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter le département.' });
        }
    };

    const handleDeleteDepartment = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
            try {
                await deleteDepartment(id);
                setDepartments(prev => prev.filter(d => d.id !== id));
                toast({ title: 'Département supprimé' });
            } catch (error) {
                console.error("Failed to delete department:", error);
                toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le département.' });
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
            <h1 className="text-3xl font-bold mb-4">Facultés, Départements et Options</h1>
            <DepartmentsTable 
                data={departments} 
                onAddDepartment={handleAddDepartment} 
                onDeleteDepartment={handleDeleteDepartment}
            />
        </div>
    )
}
