
'use client'

import { useState, useMemo, useEffect, useCallback } from 'react';
import { getExamGrades, getStudents, getCourses, addExamGrade, deleteExamGrade, updateExamGrade, Course, Student, getFaculty, Faculty, Department, getDepartments } from '@/lib/data';
import { GradesTable } from '@/components/exams/grades-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExamGrade } from '@/lib/types';
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
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


function AddGradeForm({ 
    onAddGrade, 
    allStudents, 
    allCourses, 
    allFaculty,
    allDepartments 
}: { 
    onAddGrade: (grade: Omit<ExamGrade, 'id'>) => Promise<void>, 
    allStudents: Student[], 
    allCourses: Course[], 
    allFaculty: Faculty[],
    allDepartments: Department[] 
}) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Form state
    const [courseCode, setCourseCode] = useState('');
    const [studentId, setStudentId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [examType, setExamType] = useState<'Contrôle' | 'Partiel' | 'Final'>('Contrôle');
    const [grade, setGrade] = useState<number | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    const selectedCourse = allCourses.find(c => c.code === courseCode);
    const studentsInDept = selectedCourse ? allStudents.filter(s => s.department === selectedCourse.department) : [];

    const resetForm = () => {
        setCourseCode('');
        setStudentId('');
        setTeacherId('');
        setExamType('Contrôle');
        setGrade('');
        setDate(new Date().toISOString().split('T')[0]);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const student = allStudents.find(s => s.id === studentId);
        const teacher = allFaculty.find(f => f.id === teacherId);

        if (!student || !selectedCourse || !teacher || grade === '' || !date) {
            toast({ variant: 'destructive', title: "Erreur", description: "Veuillez remplir tous les champs obligatoires." });
            return;
        }
        
        try {
            const newGradeData: Omit<ExamGrade, 'id'> = {
                studentId,
                studentName: student.name,
                courseName: selectedCourse.name,
                courseCode: selectedCourse.code,
                teacherId: teacher.id,
                teacherName: teacher.name, 
                department: student.department,
                level: selectedCourse.level,
                examType: examType,
                grade: Number(grade),
                coefficient: selectedCourse.credits || 1, 
                date,
            };
            
            await onAddGrade(newGradeData);
            toast({ title: "Note ajoutée", description: `La note de ${student.name} a été enregistrée.` });
    
            setIsOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Erreur", description: "Impossible d'ajouter la note." });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Saisir une note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Saisir une nouvelle note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                           <Label htmlFor="course">Matière</Label>
                            <Select onValueChange={setCourseCode} value={courseCode}>
                                <SelectTrigger id="course"><SelectValue placeholder="Sélectionner une matière..." /></SelectTrigger>
                                <SelectContent>
                                    {allCourses.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.department})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student">Étudiant</Label>
                            <Select onValueChange={setStudentId} value={studentId} disabled={!courseCode}>
                                <SelectTrigger id="student"><SelectValue placeholder="Sélectionner un étudiant..." /></SelectTrigger>
                                <SelectContent>
                                    {studentsInDept.length > 0 ? (
                                        studentsInDept.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Sélectionnez une matière.</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teacher">Enseignant</Label>
                            <Select onValueChange={setTeacherId} value={teacherId}>
                                <SelectTrigger id="teacher"><SelectValue placeholder="Sélectionner l'enseignant..." /></SelectTrigger>
                                <SelectContent>
                                    {allFaculty.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="examType">Type d'examen</Label>
                            <Select onValueChange={(v: 'Contrôle' | 'Partiel' | 'Final') => setExamType(v)} value={examType}>
                                <SelectTrigger id="examType"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Contrôle">Contrôle</SelectItem>
                                    <SelectItem value="Partiel">Partiel</SelectItem>
                                    <SelectItem value="Final">Final</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade">Note / 20</Label>
                            <Input id="grade" type="number" min="0" max="20" step="0.5" value={grade} onChange={e => setGrade(Number(e.target.value))} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="date">Date de l'examen</Label>
                            <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface GroupedGrades {
    [level: string]: {
        [option: string]: ExamGrade[]
    }
}

export default function GradesPage() {
  const [grades, setGrades] = useState<ExamGrade[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allFaculty, setAllFaculty] = useState<Faculty[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchData = useCallback(async () => {
      try {
          const [gradesData, studentsData, coursesData, facultyData, departmentsData] = await Promise.all([
              getExamGrades(),
              getStudents(),
              getCourses(),
              getFaculty(),
              getDepartments(),
          ]);
          setGrades(gradesData);
          setAllStudents(studentsData);
          setAllCourses(coursesData);
          setAllFaculty(facultyData);
          setAllDepartments(departmentsData.filter(d => d.parentId));
      } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les données." });
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleAddGrade = async (newGradeData: Omit<ExamGrade, 'id'>) => {
    try {
        await addExamGrade(newGradeData);
        await fetchData(); // Refetch all data to keep it consistent
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter la note.' });
        throw error;
    }
  };
  
  const handleGradeUpdate = async (updatedGrade: ExamGrade) => {
    try {
        await updateExamGrade(updatedGrade.id, updatedGrade);
        setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
        toast({ title: "Note mise à jour", description: `La note de ${updatedGrade.studentName} a été enregistrée.` });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Erreur", description: "Impossible de mettre à jour la note." });
    }
  };
  
  const handleGradeDelete = async (gradeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
        try {
            await deleteExamGrade(gradeId);
            setGrades(prev => prev.filter(g => g.id !== gradeId));
            toast({ variant: 'default', title: 'Note supprimée' });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de supprimer la note." });
        }
    }
  };

  const groupedGrades = useMemo(() => {
      let dataToGroup = grades;
      if (searchTerm) {
          const lowercasedFilter = searchTerm.toLowerCase();
          dataToGroup = grades.filter(grade => 
              grade.studentName.toLowerCase().includes(lowercasedFilter) ||
              grade.studentId.toLowerCase().includes(lowercasedFilter) ||
              grade.courseName.toLowerCase().includes(lowercasedFilter) ||
              grade.department.toLowerCase().includes(lowercasedFilter) ||
              grade.examType.toLowerCase().includes(lowercasedFilter) ||
              grade.level.toLowerCase().includes(lowercasedFilter)
          );
      }

      const groups = dataToGroup.reduce((acc, grade) => {
          const { level, department } = grade;
          if (!acc[level]) {
              acc[level] = {};
          }
          if (!acc[level][department]) {
              acc[level][department] = [];
          }
          acc[level][department].push(grade);
          return acc;
      }, {} as GroupedGrades);

      // Sort grades within each subgroup by date
      for(const level in groups) {
          for(const option in groups[level]) {
            groups[level][option].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          }
      }
      return groups;
  }, [grades, searchTerm]);

  const sortedLevelKeys = Object.keys(groupedGrades).sort((a, b) => a.localeCompare(b));

  if (loading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96 mt-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-72" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>
            <Skeleton className="h-[500px] w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">Gestion des notes d'examen</h1>
                <p className="text-muted-foreground">Consultez, ajoutez et gérez toutes les notes des étudiants par groupe.</p>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Rechercher (étudiant, matière, groupe...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <AddGradeForm 
                    onAddGrade={handleAddGrade} 
                    allStudents={allStudents} 
                    allCourses={allCourses} 
                    allFaculty={allFaculty} 
                    allDepartments={allDepartments}
                />
            </div>
        </div>

        {sortedLevelKeys.length > 0 ? (
            sortedLevelKeys.map(level => (
                <Card key={level}>
                    <CardHeader>
                        <CardTitle>{level}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <Accordion type="single" collapsible className="w-full">
                            {Object.keys(groupedGrades[level]).sort().map(option => (
                                <AccordionItem value={option} key={`${level}-${option}`}>
                                    <AccordionTrigger className="text-lg font-medium">{option}</AccordionTrigger>
                                    <AccordionContent>
                                        <GradesTable
                                            data={groupedGrades[level][option]}
                                            onGradeUpdate={handleGradeUpdate}
                                            onGradeDelete={handleGradeDelete}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ))
        ) : (
            <Card>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        {searchTerm ? "Aucun résultat ne correspond à votre recherche." : "Aucune note à afficher. Commencez par en ajouter une."}
                    </p>
                </CardContent>
            </Card>
        )}
    </div>
  )
}
