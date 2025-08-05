'use client'

import { notFound } from 'next/navigation'
import { students } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function StudentHistoryPage({ params }: { params: { id: string } }) {
  const student = students.find((s) => s.id === params.id)

  if (!student) {
    notFound()
  }

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
                <AccordionItem value={`item-${index}`} key={record.semester + record.year}>
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
      </Card>
    </div>
  )
}
