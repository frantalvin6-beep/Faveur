
'use client';

import * as React from 'react';
import { StudentFinance, Department, addStudentFinance, updateStudentFinance, accountingTransactions } from '@/lib/data';
import { StudentFinancesTableWrapper } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AddStudentFinanceForm } from './add-student-finance-form';

interface GroupedFinances {
  [key: string]: StudentFinance[];
}

export function StudentFinancesPageContent({ initialFinances, initialDepartments }: { initialFinances: StudentFinance[], initialDepartments: Department[] }) {
  const [studentFinances, setStudentFinances] = React.useState<StudentFinance[]>(initialFinances);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    setStudentFinances(initialFinances);
  }, [initialFinances]);

  const handleAddStudent = async (newStudent: StudentFinance) => {
    try {
        await addStudentFinance(newStudent);
        setStudentFinances(prev => [...prev, newStudent]);
        toast({ title: "Étudiant ajouté", description: `Les informations financières pour ${newStudent.fullName} ont été enregistrées.`});

        if (newStudent.avance > 0) {
            accountingTransactions.unshift({
                id: `TRN-STU-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                type: 'Revenu',
                sourceBeneficiary: newStudent.fullName,
                category: 'Frais scolarité',
                amount: newStudent.avance,
                paymentMethod: 'Espèces',
                description: `Paiement initial frais de scolarité`,
                responsible: 'Caissier'
            });
            toast({
                title: "Transaction enregistrée",
                description: `Un revenu de ${newStudent.avance.toLocaleString()} FCFA pour ${newStudent.fullName} a été ajouté à la comptabilité.`,
            });
        }
    } catch (error) {
        console.error("Failed to add student finance:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'étudiant.' });
    }
  };
  
  const handleUpdateStudent = async (updatedStudent: StudentFinance, newAdvance: number) => {
    const originalStudent = studentFinances.find(s => s.matricule === updatedStudent.matricule);
    const paymentAmount = newAdvance - (originalStudent?.avance || 0);

    try {
        await updateStudentFinance(updatedStudent.matricule, { avance: newAdvance });
        setStudentFinances(prev => prev.map(s => s.matricule === updatedStudent.matricule ? {...s, ...updatedStudent, avance: newAdvance} : s));
        
        if (paymentAmount > 0) {
            accountingTransactions.unshift({
                id: `TRN-STU-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                type: 'Revenu',
                sourceBeneficiary: updatedStudent.fullName,
                category: 'Frais scolarité',
                amount: paymentAmount,
                paymentMethod: 'Espèces',
                description: `Paiement frais de scolarité`,
                responsible: 'Caissier'
            });
            toast({
                title: "Transaction enregistrée",
                description: `Un revenu de ${paymentAmount.toLocaleString()} FCFA pour ${updatedStudent.fullName} a été ajouté à la comptabilité.`,
            });
        }
    } catch (error) {
        console.error("Failed to update student finance:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour les finances de l\'étudiant.' });
    }
  };


  const groupedFinances = React.useMemo(() => {
    return studentFinances.reduce((acc, student) => {
      const key = `${student.option} - ${student.level}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(student);
      return acc;
    }, {} as GroupedFinances);
  }, [studentFinances]);

  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) {
      return groupedFinances;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: GroupedFinances = {};

    for (const groupName in groupedFinances) {
      if (groupName.toLowerCase().includes(lowercasedFilter)) {
        filtered[groupName] = groupedFinances[groupName];
        continue;
      }
      
      const matchingStudents = groupedFinances[groupName].filter(student =>
        student.fullName.toLowerCase().includes(lowercasedFilter) ||
        student.matricule.toLowerCase().includes(lowercasedFilter)
      );

      if (matchingStudents.length > 0) {
        filtered[groupName] = matchingStudents;
      }
    }
    return filtered;
  }, [searchTerm, groupedFinances]);
  
  const sortedGroupKeys = Object.keys(filteredGroups).sort();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Finances des Étudiants</h1>
            <p className="text-muted-foreground">
              Suivez les frais de scolarité, groupés par option et niveau.
            </p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher par groupe, nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddStudentFinanceForm onAddStudent={handleAddStudent} departments={initialDepartments} />
         </div>
       </div>

      {sortedGroupKeys.length > 0 ? (
        sortedGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | Niveau: ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentFinancesTableWrapper 
                initialData={filteredGroups[groupName]} 
                onUpdateStudent={handleUpdateStudent}
              />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucun groupe ou étudiant ne correspond à votre recherche." : "Aucune donnée financière à afficher. Ajoutez un étudiant pour commencer."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
