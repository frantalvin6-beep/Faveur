
'use client'

import { useState, useMemo } from 'react';
import { departments as allDepartments, examGrades as allGrades, students as allStudents } from '@/lib/data';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { courseAssignments } from '@/lib/data';

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
            alert("Veuillez sélectionner un étudiant et saisir une note.");
            return;
        }

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
            coefficient: examSession.grades[0]?.coefficient || 1, // Use coefficient from existing grade or default
            date: new Date().toISOString().split('T')[0],
        };
        onAddGrade(newGrade);
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

export default function GradesPage() {
  const [grades, setGrades] = useState<ExamGrade[]>(allGrades);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddGrade = (newGrade: ExamGrade) => {
    setGrades(prev => [...prev, newGrade]);
  };
  
  const handleGradeUpdate = (updatedGrade: ExamGrade) => {
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
  };
  
  const handleGradeDelete = (gradeId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      setGrades(prev => prev.filter(g => g.id !== gradeId));
    }
  };

  const groupedGrades = useMemo(() => {
    const groups: GroupedGrades = {};

    grades.forEach(grade => {
      const department = grade.department;
      if (!groups[department]) {
        groups[department] = [];
      }

      const sessionKey = `${grade.courseCode}-${grade.examType}-${grade.teacherName}`;
      let session = groups[department].find(s => `${s.courseCode}-${s.examType}-${s.teacherName}` === sessionKey);
      
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

     // Filter based on search term
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
          // If a session matches, we might need to filter the grades within it
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

  const departmentList = allDepartments.filter(dept => !dept.id.includes('OPT'));

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
            {/* Future: Add button to create a new exam session */}
        </div>
      </div>

      {Object.keys(groupedGrades).length > 0 ? Object.keys(groupedGrades).map(departmentName => (
        <div key={departmentName} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">{departmentName}</h2>
          {groupedGrades[departmentName].map(session => (
            <Card key={`${session.courseCode}-${session.examType}-${session.teacherName}`}>
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
                    {searchTerm ? "Aucune session d'examen ou note ne correspond à votre recherche." : "Aucune note à afficher."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
