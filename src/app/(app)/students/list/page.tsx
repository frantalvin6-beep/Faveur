
'use client'

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { getStudents, getDepartments, Student, Department, addStudent, deleteStudent } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const dynamic = 'force-dynamic';

function AddStudentDialog({ onAddStudent, allDepartments }: { onAddStudent: (student: Omit<Student, 'id' | 'gpa' | 'academicHistory'>) => Promise<void>, allDepartments: Department[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [gender, setGender] = React.useState<'Masculin' | 'Féminin'>('Masculin');
  const [department, setDepartment] = React.useState('');
  const [year, setYear] = React.useState(1);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setEmail('');
    setDepartment('');
    setYear(1);
    setGender('Masculin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !department) {
      toast({variant: 'destructive', title: "Erreur", description: "Veuillez remplir tous les champs."});
      return;
    }
    
    const studentData = {
      name,
      email,
      gender,
      department,
      year,
      enrollmentDate: new Date().toISOString().split('T')[0],
    };

    try {
      await onAddStudent(studentData);
      setIsOpen(false);
      resetForm();
    } catch (error) {
       // Le toast d'erreur est déjà géré dans le composant parent
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un étudiant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel étudiant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="gender">Sexe</Label>
              <Select onValueChange={(v: 'Masculin' | 'Féminin') => setGender(v)} value={gender}>
                <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculin">Masculin</SelectItem>
                  <SelectItem value="Féminin">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département/Option</Label>
              <Select onValueChange={setDepartment} value={department} required>
                <SelectTrigger id="department"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {allDepartments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" min="1" max="5" value={year} onChange={e => setYear(Number(e.target.value))} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsData, departmentsData] = await Promise.all([getStudents(), getDepartments()]);
      setStudents(studentsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const getStudentsForDepartment = (departmentName: string): Student[] => {
    let studentsInDept = students.filter(student => student.department === departmentName);
    if (searchTerm) {
        studentsInDept = studentsInDept.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return studentsInDept;
  };
  
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'gpa' | 'academicHistory'>) => {
    try {
        const finalStudentData = {
          ...studentData,
          gpa: 0,
          academicHistory: [],
        }
        const newStudent = await addStudent(finalStudentData);
        toast({ title: "Étudiant ajouté", description: `L'étudiant ${newStudent.name} a été ajouté avec succès.` });
        await fetchData(); // Refetch
    } catch (error) {
       console.error(error);
       toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'étudiant.' });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if(confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
        try {
            await deleteStudent(id);
            toast({ title: "Étudiant supprimé", description: "L'étudiant a été retiré de la base de données." });
            await fetchData(); // Refetch
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: "Impossible de supprimer l'étudiant." });
        }
    }
  };


  const handleEdit = (id: string) => alert(`La fonctionnalité de modification de l'étudiant ${id} sera bientôt disponible.`);

   const displayedDepartments = departments.filter(dept => {
        if (!dept.parentId) return false; // On affiche seulement les options

        const studentsInDept = getStudentsForDepartment(dept.name);
        const searchMatchInDeptName = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!searchTerm) {
            return students.some(s => s.department === dept.name);
        }
        
        return searchMatchInDeptName || studentsInDept.length > 0;
    });

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
            <h1 className="text-3xl font-bold">Liste des Étudiants par Option</h1>
            <p className="text-muted-foreground">Consultez et gérez les étudiants regroupés par leur option ou département.</p>
         </div>
         <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher un étudiant ou une option..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddStudentDialog onAddStudent={handleAddStudent} allDepartments={departments.filter(d => d.parentId)} />
        </div>
       </div>

      {displayedDepartments.map((dept) => {
        const studentsForDept = getStudentsForDepartment(dept.name);
        
        // Ce contrôle supplémentaire n'est plus nécessaire grâce à la logique dans `displayedDepartments`
        // if (searchTerm && studentsForDept.length === 0 && !dept.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        //     return null;
        // }

        return (
          <Card key={dept.id}>
            <CardHeader>
              <CardTitle>{dept.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <StudentTable 
                    data={studentsForDept} 
                    onDeleteStudent={handleDeleteStudent}
                    onEditStudent={handleEdit}
                />
            </CardContent>
          </Card>
        )
      })}
       {displayedDepartments.length === 0 && !loading && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun département ou étudiant ne correspond à votre recherche." : "Aucun étudiant à afficher. Commencez par en ajouter un."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
