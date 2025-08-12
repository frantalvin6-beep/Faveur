
'use client'

import { useState, useEffect } from 'react'
import { useRouter, notFound, useParams } from 'next/navigation'
import { Student, AcademicRecord, CourseRecord, getStudent, updateStudent, getCourses, Course } from '@/lib/data'
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
import { PlusCircle, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'


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

type CourseEntry = { id: string; name: string; grade: number; coefficient: number };

// Simple GPA and decision calculation function
function calculateGpaAndDecision(courses: CourseRecord[]): { gpa: number; decision: 'Admis' | 'Échec' | 'Redoublant' } {
  if (courses.length === 0) {
    return { gpa: 0, decision: 'Échec' };
  }
  const totalPoints = courses.reduce((sum, course) => sum + course.grade * course.coefficient, 0);
  const totalCoefficients = courses.reduce((sum, course) => sum + course.coefficient, 0);
  
  if (totalCoefficients === 0) {
    return { gpa: 0, decision: 'Échec' };
  }

  const gpa = totalPoints / totalCoefficients;
  
  let decision: 'Admis' | 'Échec' | 'Redoublant';
  if (gpa >= 10) {
    decision = 'Admis';
  } else if (gpa >= 7) {
    decision = 'Redoublant';
  } else {
    decision = 'Échec';
  }
  
  return { gpa, decision };
}


function GradeEntryForm({ student, onAddRecord, allCourses }: { student: Student, onAddRecord: (record: AcademicRecord) => void, allCourses: Course[] }) {
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [courses, setCourses] = useState<Partial<CourseEntry>[]>([{ id: `C${Date.now()}`, name: '', grade: undefined, coefficient: undefined }])
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableCourses = allCourses.filter(c => c.department === student.department);

  const handleAddCourse = () => {
    setCourses([...courses, { id: `C${Date.now()}`, name: '', grade: undefined, coefficient: undefined }])
  }

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id))
  }

  const handleCourseChange = (id: string, field: keyof CourseEntry, value: string | number) => {
    setCourses(courses.map(c => {
        if (c.id === id) {
            if (field === 'name') {
                 const selectedCourse = availableCourses.find(ac => ac.name === value);
                 return { ...c, name: value as string, coefficient: selectedCourse?.credits };
            }
            if (field === 'grade') return { ...c, grade: Number(value) };
            if (field === 'coefficient') return { ...c, coefficient: Number(value) };
        }
        return c;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCourses = courses.filter(c => c.name && c.grade !== undefined && c.coefficient !== undefined && c.coefficient > 0) as CourseRecord[];
    
    if (!semester || !year || finalCourses.length === 0 || finalCourses.length !== courses.length) {
      alert("Veuillez remplir tous les champs requis, y compris les coefficients qui doivent être supérieurs à 0.");
      return;
    }
    
    setIsLoading(true);
    
    try {
        const result = calculateGpaAndDecision(finalCourses);

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
        setCourses([{ id: `C${Date.now()}`, name: '', grade: undefined, coefficient: undefined }]);
    } catch (error) {
        console.error("Failed to calculate GPA:", error);
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
      <DialogContent className="sm:max-w-[725px]">
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
                <div className="grid grid-cols-[1fr_100px_100px_auto] gap-2 mb-2 px-2">
                    <Label>Matière</Label>
                    <Label>Note /20</Label>
                    <Label>Coeff.</Label>
                    <span></span>
                </div>
                <div className="space-y-2">
                  {courses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-2">
                      <Select value={course.name ?? ''} onValueChange={v => handleCourseChange(course.id!, 'name', v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner une matière..." /></SelectTrigger>
                        <SelectContent>
                            {availableCourses.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Note" value={course.grade ?? ''} onChange={e => handleCourseChange(course.id!, 'grade', e.target.value)} required min="0" max="20" step="0.5" />
                      <Input type="number" placeholder="Coeff." value={course.coefficient ?? ''} onChange={e => handleCourseChange(course.id!, 'coefficient', e.target.value)} required min="1" />
                      <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveCourse(course.id!)} disabled={courses.length === 1}>
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

export default function StudentHistoryPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const router = useRouter();
  const params = useParams();
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
      if (!studentId) return;

      async function fetchData() {
          try {
              const studentData = await getStudent(studentId);
              if (studentData) {
                  setStudent(studentData);
              } else {
                  notFound();
              }
              const coursesData = await getCourses();
              setAllCourses(coursesData);
          } catch (error) {
              console.error("Failed to fetch student data:", error);
              notFound();
          }
      }
      fetchData();
  }, [studentId]);

  if (!student) {
      return (
          <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
          </div>
      );
  }

  const handleAddRecord = async (record: AcademicRecord) => {
    const newHistory = [...student.academicHistory, record];
    newHistory.sort((a, b) => a.year - b.year || a.semester.localeCompare(b.semester));
    const updatedStudent = { ...student, academicHistory: newHistory };
    
    try {
        await updateStudent(student.id, { academicHistory: newHistory });
        setStudent(updatedStudent);
    } catch (error) {
        console.error("Failed to update student history:", error);
        alert("Erreur lors de la mise à jour de l'historique.");
    }
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Button>
            <h1 className="text-3xl font-bold">{student.name}</h1>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Dossier de l'étudiant</CardTitle>
          <CardDescription>Informations personnelles et de contact.</CardDescription>
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
          <CardTitle>Historique académique</CardTitle>
          <CardDescription>Détail des résultats par semestre.</CardDescription>
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
                          <TableHead className="text-right">Coefficient</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.courses.map((course) => (
                          <TableRow key={course.name}>
                            <TableCell>{course.name}</TableCell>
                            <TableCell className="text-right font-medium">{course.grade}</TableCell>
                            <TableCell className="text-right font-medium">{course.coefficient}</TableCell>
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
            <GradeEntryForm student={student} onAddRecord={handleAddRecord} allCourses={allCourses} />
        </CardFooter>
      </Card>
    </div>
  )
}
