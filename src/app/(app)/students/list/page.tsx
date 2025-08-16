
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export const dynamic = 'force-dynamic';

function getLevelName(year: number) {
    if (year <= 3) return `Licence ${year}`;
    return `Master ${year - 3}`;
}

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
              <Select onValueChange={(v) => setYear(Number(v))} value={String(year)}>
                  <SelectTrigger id="year"><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="1">Licence 1</SelectItem>
                      <SelectItem value="2">Licence 2</SelectItem>
                      <SelectItem value="3">Licence 3</SelectItem>
                      <SelectItem value="4">Master 1</SelectItem>
                      <SelectItem value="5">Master 2</SelectItem>
                  </SelectContent>
              </Select>
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

interface GroupedStudents {
  [option: string]: {
    [level: string]: Student[];
  }
}

export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [academicYears, setAcademicYears] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentsData, departmentsData] = await Promise.all([getStudents(), getDepartments()]);
      setStudents(studentsData);
      setDepartments(departmentsData);
      
      const years = getAcademicYears(studentsData);
      setAcademicYears(years);
      if (years.length > 0) {
          setSelectedYear(years[0]);
      }
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
  
  const filteredStudentsByYear = React.useMemo(() => {
      if (!selectedYear) return students;
      const [startYear] = selectedYear.split('-').map(Number);
      return students.filter(s => new Date(s.enrollmentDate).getFullYear() === startYear);
  }, [selectedYear, students]);
  
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'gpa' | 'academicHistory'>) => {
    try {
        const newStudent = await addStudent(studentData);
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

  const options = departments.filter(d => d.parentId);

  const groupedStudents = React.useMemo(() => {
    let studentsToGroup = filteredStudentsByYear;
    if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        studentsToGroup = studentsToGroup.filter(student =>
            student.name.toLowerCase().includes(lowercasedFilter) ||
            student.id.toLowerCase().includes(lowercasedFilter) ||
            student.department.toLowerCase().includes(lowercasedFilter) ||
            `Licence ${student.year}`.toLowerCase().includes(lowercasedFilter) ||
            `Master ${student.year}`.toLowerCase().includes(lowercasedFilter)
        );
    }
    
    return studentsToGroup.reduce((acc, student) => {
        const level = getLevelName(student.year);
        if (!acc[student.department]) acc[student.department] = {};
        if (!acc[student.department][level]) acc[student.department][level] = [];
        acc[student.department][level].push(student);
        return acc;
    }, {} as GroupedStudents);

  }, [filteredStudentsByYear, searchTerm]);

  const sortedDepartmentKeys = Object.keys(groupedStudents).sort();

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <div><Skeleton className="h-8 w-72" /><Skeleton className="h-4 w-96 mt-2" /></div>
                  <Skeleton className="h-10 w-72" />
              </div>
              <Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Liste des Étudiants</h1>
            <p className="text-muted-foreground">Consultez et gérez les étudiants regroupés par option et niveau.</p>
         </div>
         <div className="flex items-center gap-4">
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
            <Input
                placeholder="Rechercher (option, niveau, étudiant...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <AddStudentDialog onAddStudent={handleAddStudent} allDepartments={options} />
        </div>
       </div>

       <div className="space-y-8">
            {sortedDepartmentKeys.map((department) => {
                const departmentLevels = Object.keys(groupedStudents[department]).sort();

                if (departmentLevels.length === 0) return null;

                return (
                    <Card key={department}>
                        <CardHeader>
                            <CardTitle className="text-2xl">{department}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Accordion type="single" collapsible className="w-full">
                                {departmentLevels.map(level => (
                                    <AccordionItem value={level} key={`${department}-${level}`}>
                                        <AccordionTrigger className="text-xl">{level}</AccordionTrigger>
                                        <AccordionContent>
                                             <StudentTable
                                                data={groupedStudents[department][level]}
                                                onDeleteStudent={handleDeleteStudent}
                                                onEditStudent={handleEdit}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                           </Accordion>
                        </CardContent>
                    </Card>
                )
            })}
        </div>

       {sortedDepartmentKeys.length === 0 && !loading && (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun étudiant ne correspond à votre recherche." : "Aucun étudiant à afficher. Commencez par en ajouter un."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
