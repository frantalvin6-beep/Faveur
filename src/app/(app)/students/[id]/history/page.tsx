'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { students as initialStudents, Student, AcademicRecord, CourseRecord } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2, Loader2 } from 'lucide-react'
import { calculateGpa } from '@/ai/flows/calculate-student-gpa'


function getDecisionBadgeVariant(decision: string) {
  switch (decision) {
    case 'Admis':
      return 'default'
    case 'Échec':
      return 'destructive'
    case 'Redoublant':
      return 'secondary'
    default:
      return 'outline'
  }
}

function GradeEntryForm({ student, onAddRecord }: { student: Student, onAddRecord: (record: AcademicRecord) => void }) {
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [courses, setCourses] = useState<Partial<CourseRecord>[]>([{ name: '', grade: undefined }])
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCourse = () => {
    setCourses([...courses, { name: '', grade: undefined }])
  }

  const handleRemoveCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const handleCourseChange = (index: number, field: 'name' | 'grade', value: string | number) => {
    const newCourses = [...courses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    setCourses(newCourses)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourses = courses.filter(c => c.name && c.grade !== undefined) as CourseRecord[];
    if (!semester || !year || finalCourses.length === 0) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }
    
    setIsLoading(true);
    
    try {
        const result = await calculateGpa({ courses: finalCourses });

        const newRecord: AcademicRecord = {
          semester,
          year,
          courses: finalCourses,
          gpa: result.gpa,
          decision: result.decision,
        };

        onAddRecord(newRecord);
        setIsOpen(false);
        // Reset form
        setSemester('');
        setYear(new Date().getFullYear());
        setCourses([{ name: '', grade: undefined }]);
    } catch (error) {
        console.error("Failed to calculate GPA with AI:", error);
        alert("Une erreur est survenue lors du calcul de la moyenne. Veuillez réessayer.");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Saisir les notes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Saisie des notes pour {student.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="semester">Semestre</Label>
                      <Input id="semester" placeholder="Ex: Semestre 3" value={semester} onChange={e => setSemester(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="year">Année</Label>
                      <Input id="year" type="number" placeholder="Ex: 2024" value={year} onChange={e => setYear(parseInt(e.target.value))} required />
                  </div>
              </div>
              <div>
                <Label>Matières et notes</Label>
                <div className="space-y-2 mt-2">
                  {courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input placeholder="Nom de la matière" value={course.name ?? ''} onChange={e => handleCourseChange(index, 'name', e.target.value)} required />
                      <Input type="number" placeholder="Note" value={course.grade ?? ''} onChange={e => handleCourseChange(index, 'grade', parseFloat(e.target.value))} required min="0" max="20" step="0.5" />
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveCourse(index)} disabled={courses.length === 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <Button type="button" variant="outline" size="sm" onClick={handleAddCourse} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une matière
                </Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isLoading}>Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer les notes
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


export default function StudentHistoryPage({ params }: { params: { id: string } }) {
  const [students, setStudents] = useState(initialStudents);
  const student = students.find((s) => s.id === params.id)

  if (!student) {
    notFound()
  }
  
  const handleAddRecord = (record: AcademicRecord) => {
    const updatedStudents = students.map(s => {
      if (s.id === student.id) {
        // Create a new academicHistory array with the new record
        const newHistory = [...s.academicHistory, record];
        // Sort the history to ensure chronological order (optional but good practice)
        newHistory.sort((a, b) => a.year - b.year || a.semester.localeCompare(b.semester));
        return { ...s, academicHistory: newHistory };
      }
      return s;
    });
    setStudents(updatedStudents);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{student.name}</CardTitle>
          <CardDescription>Historique académique complet de l'étudiant.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><span className="font-semibold">Matricule:</span> {student.id}</div>
          <div><span className="font-semibold">Email:</span> {student.email}</div>
          <div><span className="font-semibold">Sexe:</span> {student.gender}</div>
          <div><span className="font-semibold">Département:</span> {student.department}</div>
          <div><span className="font-semibold">Année d'inscription:</span> {new Date(student.enrollmentDate).getFullYear()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résultats académiques</CardTitle>
        </CardHeader>
        <CardContent>
          {student.academicHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {student.academicHistory.map((record, index) => (
                <AccordionItem value={`item-${index}`} key={`${record.semester}-${record.year}-${index}`}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                        <span className="font-semibold">{record.semester} - {record.year}</span>
                        <div className="flex items-center gap-4">
                           <span>Moyenne: <Badge variant="secondary">{record.gpa.toFixed(2)}</Badge></span>
                           <span>Décision: <Badge variant={getDecisionBadgeVariant(record.decision)}>{record.decision}</Badge></span>
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matière</TableHead>
                          <TableHead className="text-right">Note</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.courses.map((course) => (
                          <TableRow key={course.name}>
                            <TableCell>{course.name}</TableCell>
                            <TableCell className="text-right font-medium">{course.grade}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Aucun historique académique disponible pour cet étudiant.
            </div>
          )}
        </CardContent>
         <CardFooter>
            <GradeEntryForm student={student} onAddRecord={handleAddRecord} />
        </CardFooter>
      </Card>
    </div>
  )
}
