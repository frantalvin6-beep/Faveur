
'use client';

import * as React from 'react';
import { getStudentFinances, getDepartments, addStudentFinance, updateStudentFinance, addAccountingTransaction, StudentFinance, Department, AccountingTransaction, getStudents, Student } from '@/lib/data';
import { StudentFinancesPageContent } from '@/components/finances/student-finances-page-content';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export const dynamic = 'force-dynamic';

function getAcademicYears(students: Student[]): string[] {
    const years = new Set<number>();
    students.forEach(s => years.add(new Date(s.enrollmentDate).getFullYear()));
    
    if (years.size === 0) {
        const currentYear = new Date().getFullYear();
        return [`${currentYear}-${currentYear + 1}`];
    }

    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.map(year => `${year}-${year + 1}`);
}

export default function StudentFinancesPage() {
  const [allFinances, setAllFinances] = React.useState<StudentFinance[]>([]);
  const [allStudents, setAllStudents] = React.useState<Student[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [academicYears, setAcademicYears] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [finances, depts, students] = await Promise.all([
        getStudentFinances(),
        getDepartments(),
        getStudents(),
      ]);
      
      setAllFinances(finances);
      setAllStudents(students);
      setDepartments(depts.filter(d => d.parentId)); 
      
      const years = getAcademicYears(students);
      setAcademicYears(years);
      if (years.length > 0) {
          setSelectedYear(years[0]);
      }
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

  const filteredFinances = React.useMemo(() => {
    if (!selectedYear) return allFinances;
    
    const [startYear] = selectedYear.split('-').map(Number);
    const studentsForYear = allStudents
        .filter(s => new Date(s.enrollmentDate).getFullYear() === startYear)
        .map(s => s.id);

    return allFinances.filter(f => studentsForYear.includes(f.matricule));
  }, [selectedYear, allFinances, allStudents]);

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
    const originalStudent = allFinances.find(s => s.matricule === updatedStudentData.matricule);
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
  
  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Finances des Étudiants</h1>
            <p className="text-muted-foreground">
              Suivez les frais de scolarité, groupés par option et niveau.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Label htmlFor="academic-year">Année Académique</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="academic-year" className="w-[180px]">
                    <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                    {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>
      <StudentFinancesPageContent 
        initialFinances={filteredFinances} 
        initialDepartments={departments}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
      />
    </div>
  );
}
