
'use client';

import * as React from 'react';
import { StudentFinance, getStudentFinances, addStudentFinance, updateStudentFinance, calculerFinance, accountingTransactions, getDepartments, Department } from '@/lib/data';
import { StudentFinancesTable } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupedFinances {
  [key: string]: StudentFinance[];
}


function AddStudentFinanceForm({ onAddStudent }: { onAddStudent: (student: StudentFinance) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [departments, setDepartments] = React.useState<Department[]>([]);

    // Form state
    const [matricule, setMatricule] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [option, setOption] = React.useState('');
    const [inscription, setInscription] = React.useState(50000);
    const [semester, setSemester] = React.useState<'Pair' | 'Impair'>('Impair');
    const [fournitures, setFournitures] = React.useState(20000);
    const [support, setSupport] = React.useState(10000);
    const [bourseType, setBourseType] = React.useState<StudentFinance['bourseType']>('Non boursier');
    const [reduction, setReduction] = React.useState(0);
    const [scolariteBase, setScolariteBase] = React.useState(400000);
    const [latrine, setLatrine] = React.useState(3000);
    const [session, setSession] = React.useState(15000);
    const [rattrapage, setRattrapage] = React.useState(0);
    const [avance, setAvance] = React.useState(0);

    React.useEffect(() => {
        async function fetchDepartments() {
            const depts = await getDepartments();
            setDepartments(depts);
        }
        fetchDepartments();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matricule || !fullName || !level || !option) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const calculated = calculerFinance(inscription, fournitures, support, bourseType, reduction, scolariteBase, latrine, session, rattrapage, avance);
        
        const newStudent: StudentFinance = {
            matricule, fullName, level, option, inscription, semester, fournitures, support, bourseType, reduction,
            scolariteBase, latrine, session, rattrapage, avance, ...calculated
        };

        onAddStudent(newStudent);
        setIsOpen(false);
        // Reset form
        setMatricule('');
        setFullName('');
        setLevel('');
        setOption('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un étudiant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel étudiant aux finances</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
                   <ScrollArea className="flex-grow pr-6 -mr-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                            {/* Champs principaux */}
                            <div className="space-y-2"><Label htmlFor="matricule">Matricule</Label><Input id="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required /></div>
                            <div className="space-y-2"><Label htmlFor="fullName">Nom & Prénom</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                            <div className="space-y-2"><Label htmlFor="level">Niveau d'études</Label><Input id="level" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Ex: Licence 1" required /></div>
                            <div className="space-y-2"><Label htmlFor="option">Option</Label><Select onValueChange={setOption} value={option}><SelectTrigger id="option"><SelectValue placeholder="Sélectionner..." /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label htmlFor="semester">Semestre</Label><Select onValueChange={(v: 'Pair' | 'Impair') => setSemester(v)} value={semester}><SelectTrigger id="semester"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Impair">Impair</SelectItem><SelectItem value="Pair">Pair</SelectItem></SelectContent></Select></div>
                            
                            {/* Champs financiers */}
                            <div className="space-y-2"><Label htmlFor="inscription">Frais d'inscription</Label><Input id="inscription" type="number" value={inscription} onChange={(e) => setInscription(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="fournitures">Frais de fournitures</Label><Input id="fournitures" type="number" value={fournitures} onChange={(e) => setFournitures(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="support">Frais de support</Label><Input id="support" type="number" value={support} onChange={(e) => setSupport(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="latrine">Frais de latrine</Label><Input id="latrine" type="number" value={latrine} onChange={(e) => setLatrine(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="session">Frais de session</Label><Input id="session" type="number" value={session} onChange={(e) => setSession(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="rattrapage">Frais de rattrapage</Label><Input id="rattrapage" type="number" value={rattrapage} onChange={(e) => setRattrapage(Number(e.target.value))} /></div>
                            
                            {/* Scolarité et Bourse */}
                            <div className="space-y-2"><Label htmlFor="bourseType">Type de Bourse</Label><Select onValueChange={(v: StudentFinance['bourseType']) => setBourseType(v)} value={bourseType}><SelectTrigger id="bourseType"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Non boursier">Non boursier</SelectItem><SelectItem value="Boursier">Boursier</SelectItem><SelectItem value="Partiellement boursier">Partiellement boursier</SelectItem></SelectContent></Select></div>
                            {bourseType === 'Partiellement boursier' && <div className="space-y-2"><Label htmlFor="reduction">% Réduction</Label><Input id="reduction" type="number" value={reduction} onChange={(e) => setReduction(Number(e.target.value))} /></div>}
                            <div className="space-y-2"><Label htmlFor="scolariteBase">Scolarité de base</Label><Input id="scolariteBase" type="number" value={scolariteBase} onChange={(e) => setScolariteBase(Number(e.target.value))} /></div>
                            
                            {/* Avance */}
                            <div className="space-y-2"><Label htmlFor="avance">Avance</Label><Input id="avance" type="number" value={avance} onChange={(e) => setAvance(Number(e.target.value))} /></div>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 flex-shrink-0">
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer l'étudiant</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function StudentFinancesPage() {
  const [studentFinances, setStudentFinances] = React.useState<StudentFinance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const data = await getStudentFinances();
            setStudentFinances(data);
        } catch (error) {
            console.error("Failed to fetch student finances:", error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données financières.' });
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleAddStudent = async (newStudent: StudentFinance) => {
    try {
        await addStudentFinance(newStudent);
        setStudentFinances(prev => [...prev, newStudent]);
        toast({ title: "Étudiant ajouté", description: `Les informations financières pour ${newStudent.fullName} ont été enregistrées.`});

        if (newStudent.avance > 0) {
            // This part still uses local data, should be migrated to a service
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
  
  const handleUpdateStudent = async (updatedStudent: StudentFinance) => {
    const originalStudent = studentFinances.find(s => s.matricule === updatedStudent.matricule);
    const paymentAmount = updatedStudent.avance - (originalStudent?.avance || 0);

    try {
        await updateStudentFinance(updatedStudent.matricule, updatedStudent);
        setStudentFinances(prev => prev.map(s => s.matricule === updatedStudent.matricule ? updatedStudent : s));
        
        if (paymentAmount > 0) {
            // This part still uses local data, should be migrated to a service
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
            <AddStudentFinanceForm onAddStudent={handleAddStudent} />
         </div>
       </div>

      {sortedGroupKeys.length > 0 ? (
        sortedGroupKeys.map((groupName) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle>{groupName.replace(' - ', ' | Niveau: ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentFinancesTable 
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
