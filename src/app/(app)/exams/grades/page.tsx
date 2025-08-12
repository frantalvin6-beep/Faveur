
'use client'

import { useState, useMemo, useEffect, useCallback } from 'react';
import { getExamGrades, getStudents, getCourses, addExamGrade, deleteExamGrade, updateExamGrade, Course, Student } from '@/lib/data';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';


function AddGradeForm({ onAddGrade, allStudents, allCourses }: { onAddGrade: (grade: Omit<ExamGrade, 'id'>) => Promise<void>, allStudents: Student[], allCourses: Course[] }) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Form state
    const [courseCode, setCourseCode] = useState('');
    const [studentId, setStudentId] = useState('');
    const [examType, setExamType] = useState<'Contrôle' | 'Partiel' | 'Final'>('Contrôle');
    const [grade, setGrade] = useState<number | ''>('');
    
    const selectedCourse = allCourses.find(c => c.code === courseCode);
    const studentsInDept = selectedCourse ? allStudents.filter(s => s.department === selectedCourse.department) : [];

    const resetForm = () => {
        setCourseCode('');
        setStudentId('');
        setExamType('Contrôle');
        setGrade('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const student = allStudents.find(s => s.id === studentId);
        if (!student || !selectedCourse || grade === '') {
            toast({ variant: 'destructive', title: "Erreur", description: "Veuillez remplir tous les champs." });
            return;
        }
        
        // Find teacher from course assignments (a bit more robust)
        const teacherName = "N/A"; // This part needs improvement, maybe from courseAssignments

        try {
            const newGradeData: Omit<ExamGrade, 'id'> = {
                studentId,
                studentName: student.name,
                courseName: selectedCourse.name,
                courseCode: selectedCourse.code,
                teacherName: teacherName, 
                department: student.department,
                examType: examType,
                grade: Number(grade),
                coefficient: selectedCourse.credits || 1, 
                date: new Date().toISOString().split('T')[0],
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Saisir une nouvelle note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
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
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Sélectionnez une matière pour voir les étudiants.</div>
                                    )}
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

export default function GradesPage() {
  const [grades, setGrades] = useState<ExamGrade[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchData = useCallback(async () => {
      try {
          // setLoading(true) is only for the initial load
          const [gradesData, studentsData, coursesData] = await Promise.all([
              getExamGrades(),
              getStudents(),
              getCourses()
          ]);
          setGrades(gradesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setAllStudents(studentsData);
          setAllCourses(coursesData);
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
        const newGrade = await addExamGrade(newGradeData);
        setGrades(prev => [newGrade, ...prev]);
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

  const filteredGrades = useMemo(() => {
      if (!searchTerm) return grades;
      const lowercasedFilter = searchTerm.toLowerCase();
      return grades.filter(grade => 
          grade.studentName.toLowerCase().includes(lowercasedFilter) ||
          grade.studentId.toLowerCase().includes(lowercasedFilter) ||
          grade.courseName.toLowerCase().includes(lowercasedFilter) ||
          grade.department.toLowerCase().includes(lowercasedFilter) ||
          grade.examType.toLowerCase().includes(lowercasedFilter)
      );
  }, [grades, searchTerm]);

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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gestion des notes d'examen</CardTitle>
                        <CardDescription>Consultez, ajoutez et gérez toutes les notes des étudiants en un seul endroit.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Rechercher (étudiant, matière, département...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <AddGradeForm onAddGrade={handleAddGrade} allStudents={allStudents} allCourses={allCourses} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <GradesTable
                    data={filteredGrades}
                    onGradeUpdate={handleGradeUpdate}
                    onGradeDelete={handleGradeDelete}
                />
            </CardContent>
        </Card>
    </div>
  )
}
