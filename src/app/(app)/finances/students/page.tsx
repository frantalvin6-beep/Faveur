
'use client';

import * as React from 'react';
import { getStudentFinances, getDepartments, addStudentFinance, updateStudentFinance, addAccountingTransaction, StudentFinance, Department, AccountingTransaction } from '@/lib/data';
import { StudentFinancesPageContent } from '@/components/finances/student-finances-page-content';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

export default function StudentFinancesPage() {
  const [studentFinances, setStudentFinances] = React.useState<StudentFinance[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [finances, depts] = await Promise.all([
        getStudentFinances(),
        getDepartments()
      ]);
      setStudentFinances(finances);
      // We only need the options (departments with a parent) for the form
      setDepartments(depts.filter(d => d.parentId)); 
    } catch (error) {
      console.error("Failed to fetch student finances data:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les finances des étudiants.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddStudent = async (newStudent: StudentFinance) => {
    try {
        await addStudentFinance(newStudent);
        toast({ title: "Étudiant ajouté", description: `Les informations financières pour ${newStudent.fullName} ont été enregistrées.`});

        if (newStudent.avance > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Revenu',
                sourceBeneficiary: newStudent.fullName,
                category: 'Frais scolarité',
                amount: newStudent.avance,
                paymentMethod: 'Espèces',
                description: `Paiement initial frais de scolarité`,
                responsible: 'Caissier'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Un revenu de ${newStudent.avance.toLocaleString()} FCFA pour ${newStudent.fullName} a été ajouté à la comptabilité.`,
            });
        }
        await fetchData(); // Refetch
    } catch (error) {
        console.error("Failed to add student finance:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'étudiant.' });
    }
  };
  
  const handleUpdateStudent = async (updatedStudentData: StudentFinance, newAdvance: number) => {
    const originalStudent = studentFinances.find(s => s.matricule === updatedStudentData.matricule);
    const paymentAmount = newAdvance - (originalStudent?.avance || 0);

    try {
        await updateStudentFinance(updatedStudentData.matricule, updatedStudentData);
        
        if (paymentAmount > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Revenu',
                sourceBeneficiary: updatedStudentData.fullName,
                category: 'Frais scolarité',
                amount: paymentAmount,
                paymentMethod: 'Espèces', // Or derive from context
                description: `Paiement frais de scolarité`,
                responsible: 'Caissier'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Un revenu de ${paymentAmount.toLocaleString()} FCFA pour ${updatedStudentData.fullName} a été ajouté à la comptabilité.`,
            });
        } else if (paymentAmount < 0) {
             toast({
                title: "Correction de paiement",
                description: `Le paiement de ${updatedStudentData.fullName} a été ajusté. Pensez à vérifier la comptabilité générale.`,
            });
        }

        await fetchData(); // Refetch
        toast({title: "Mise à jour réussie", description: `La fiche de ${updatedStudentData.fullName} a été mise à jour.`})

    } catch (error) {
        console.error("Failed to update student finance:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour les finances de l\'étudiant.' });
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return <StudentFinancesPageContent 
    initialFinances={studentFinances} 
    initialDepartments={departments}
    onAddStudent={handleAddStudent}
    onUpdateStudent={handleUpdateStudent}
   />;
}
