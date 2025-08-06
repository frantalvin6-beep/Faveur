
'use client'

import { useState, useMemo } from 'react';
import { departments as allDepartments, examGrades as allGrades, students as allStudents, courses as allCourses, initialCourses, examGrades } from '@/lib/data';
import { GradesTable } from '@/components/exams/grades-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExamGrade } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
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
import { courseAssignments } from '@/lib/data';
import { students } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

interface ExamSession {
    courseName: string;
    courseCode: string;
    teacherName: string;
    examType: 'Contrôle' | 'Partiel' | 'Final';
    grades: ExamGrade[];
}

interface GroupedGrades {
    [key: string]: ExamSession[];
}

function AddGradeForm({ examSession, department, onAddGrade }: { examSession: ExamSession, department: string, onAddGrade: (grade: ExamGrade) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [grade, setGrade] = useState<number | ''>('');

    const studentsInDept = allStudents.filter(s => s.department === department);
    const studentsWithoutGrade = studentsInDept.filter(s => 
        !examSession.grades.some(g => g.studentId === s.id)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const student = allStudents.find(s => s.id === studentId);
        if (!student || grade === '') {
            toast({ variant: 'destructive', title: "Erreur", description: "Veuillez sélectionner un étudiant et saisir une note." });
            return;
        }

        const course = allCourses.find(c => c.code === examSession.courseCode);
        
        const newGrade: ExamGrade = {
            id: `G${Date.now()}`,
            studentId,
            studentName: student.name,
            courseName: examSession.courseName,
            courseCode: examSession.courseCode,
            teacherName: examSession.teacherName,
            department: department,
            examType: examSession.examType,
            grade: Number(grade),
            coefficient: course?.credits || 1, 
            date: new Date().toISOString().split('T')[0],
        };
        onAddGrade(newGrade);
        
        toast({ title: "Note ajoutée", description: `La note de ${newGrade.studentName} a été enregistrée.` });

        setIsOpen(false);
        setStudentId('');
        setGrade('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Saisir une note
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Saisir une note pour</DialogTitle>
                    <DialogDescription>{examSession.courseName} - {examSession.examType}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="student">Étudiant</Label>
                            <Select onValueChange={setStudentId} value={studentId}>
                                <SelectTrigger id="student"><SelectValue placeholder="Sélectionner un étudiant..." /></SelectTrigger>
                                <SelectContent>
                                    {studentsWithoutGrade.length > 0 ? (
                                        studentsWithoutGrade.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">Tous les étudiants ont une note.</div>
                                    )}
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

function processAndGetAllGrades() {
    const allStudentGrades = allGrades.map(g => g); // Create a mutable copy

    students.forEach(student => {
        student.academicHistory.forEach(record => {
            record.courses.forEach(course => {
                const assignedCourse = courseAssignments.find(ca => ca.courseName === course.name && allDepartments.find(d => d.name === ca.department)?.id === allDepartments.find(d=>d.name === student.department)?.id.split('-')[0]);
                const gradeId = `G-${student.id}-${record.year}-${record.semester}-${course.name}`;

                // Avoid adding duplicate grades if they already exist from academic history
                if (!allStudentGrades.some(g => g.id === gradeId)) {
                    allStudentGrades.push({
                        id: gradeId,
                        studentId: student.id,
                        studentName: student.name,
                        courseCode: assignedCourse?.courseCode || 'N/A',
                        courseName: course.name,
                        teacherName: assignedCourse?.teacherName || 'N/A',
                        department: student.department,
                        examType: 'Final', 
                        grade: course.grade,
                        coefficient: course.coefficient,
                        date: `${record.year}-01-01`, 
                    });
                }
            });
        });
    });

    return allStudentGrades;
}


export default function GradesPage() {
  const [grades, setGrades] = useState<ExamGrade[]>(processAndGetAllGrades());
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddGrade = (newGrade: ExamGrade) => {
    // Add to the shared data source
    allGrades.push(newGrade);
    // Update local state to re-render
    setGrades(prev => [...prev, newGrade]);
  };
  
  const handleGradeUpdate = (updatedGrade: ExamGrade) => {
    // Update the shared data source
    const index = allGrades.findIndex(g => g.id === updatedGrade.id);
    if (index > -1) {
        allGrades[index] = updatedGrade;
    }
    // Update local state to re-render
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
  };
  
  const handleGradeDelete = (gradeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      // Remove from the shared data source
      const index = allGrades.findIndex(g => g.id === gradeId);
      if (index > -1) {
          allGrades.splice(index, 1);
      }
      // Remove from local state to re-render
      setGrades(prev => prev.filter(g => g.id !== gradeId));
      toast({ variant: 'destructive', title: 'Note supprimée' });
    }
  };

  const groupedGrades = useMemo(() => {
    const groups: GroupedGrades = {};

    // Use the component's state for rendering
    grades.forEach(grade => {
      const department = grade.department;
      if (!groups[department]) {
        groups[department] = [];
      }
      
      const sessionKey = `${grade.courseCode}-${grade.examType}`;
      let session = groups[department].find(s => `${s.courseCode}-${s.examType}` === sessionKey);
      
      if (!session) {
        session = {
          courseName: grade.courseName,
          courseCode: grade.courseCode,
          teacherName: grade.teacherName,
          examType: grade.examType,
          grades: []
        };
        groups[department].push(session);
      }
      session.grades.push(grade);
    });
    
    // Sort sessions within each department
    for (const dept in groups) {
      groups[dept].sort((a,b) => a.courseName.localeCompare(b.courseName));
    }


    if (!searchTerm) return groups;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredGroups: GroupedGrades = {};

    for (const deptName in groups) {
      if (deptName.toLowerCase().includes(lowercasedFilter)) {
          filteredGroups[deptName] = groups[deptName];
          continue;
      }
      
      const matchingSessions = groups[deptName].filter(session => {
          const sessionMatch = session.courseName.toLowerCase().includes(lowercasedFilter) ||
                               session.teacherName.toLowerCase().includes(lowercasedFilter);
          if (sessionMatch) return true;

          const studentMatch = session.grades.some(grade => 
              grade.studentName.toLowerCase().includes(lowercasedFilter) ||
              grade.studentId.toLowerCase().includes(lowercasedFilter)
          );
          return studentMatch;
      });

      if (matchingSessions.length > 0) {
          const sessionsWithFilteredGrades = matchingSessions.map(session => {
               const filteredGrades = session.grades.filter(grade => 
                    session.courseName.toLowerCase().includes(lowercasedFilter) ||
                    session.teacherName.toLowerCase().includes(lowercasedFilter) ||
                    grade.studentName.toLowerCase().includes(lowercasedFilter) ||
                    grade.studentId.toLowerCase().includes(lowercasedFilter)
               );
               return {...session, grades: filteredGrades};
           }).filter(s => s.grades.length > 0);

          if(sessionsWithFilteredGrades.length > 0) {
            filteredGroups[deptName] = sessionsWithFilteredGrades;
          }
      }
    }
    return filteredGroups;
  }, [grades, searchTerm]);

  const sortedDepartmentKeys = Object.keys(groupedGrades).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saisie des Notes par Session</h1>
          <p className="text-muted-foreground">Consultez et gérez les notes des étudiants, regroupées par session d'examen.</p>
        </div>
        <div className="flex items-center gap-2">
            <Input
                placeholder="Rechercher (option, matière, étudiant...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
      </div>

      {sortedDepartmentKeys.length > 0 ? sortedDepartmentKeys.map((departmentName) => (
        <div key={departmentName} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{departmentName}</h2>
          {groupedGrades[departmentName].map((session, index) => (
            <Card key={`${session.courseCode}-${session.examType}-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{session.courseName} - {session.examType}</CardTitle>
                        <CardDescription>Enseignant: {session.teacherName} | {session.grades.length} notes saisies</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <AddGradeForm examSession={session} department={departmentName} onAddGrade={handleAddGrade} />
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <GradesTable 
                    data={session.grades} 
                    onGradeUpdate={handleGradeUpdate}
                    onGradeDelete={handleGradeDelete}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )) : (
        <Card>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">
                    {searchTerm ? "Aucune session d'examen ou note ne correspond à votre recherche." : "Aucune note à afficher. Saisissez des notes pour commencer."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
