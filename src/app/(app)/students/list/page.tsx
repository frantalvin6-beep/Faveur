'use client'

import { useState } from 'react';
import { students as allStudents } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Student } from '@/lib/types';

// La structure des filières telle que définie dans la page de répartition
const filieres = [
    {
        name: "Filière : IA & Business",
        departments: ["Département IA et Robotique", "Big Data", "Intelligence Artificielle (IA)", "Programmation", "Mécatronique"]
    },
    {
        name: "Filière : Numérique (Industrielle et Technologique)",
        departments: ["Département Génie Électrique et Informatique Industrielle", "Électronique", "Électrotechnique", "Maintenance Industrielle", "Département Génie Informatique", "Réseaux et Télécommunications", "Cybersécurité", "Maintenance Informatique"]
    },
    {
        name: "Filière : Génie Civil",
        departments: ["Filière Génie Civil", "Architecture et Urbanisme"]
    },
    {
        name: "Filière : Digital Business",
        departments: ["Filière Digital Business", "Ressources Humaines axées Digital"]
    }
];

export default function StudentsListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStudentsForFiliere = (filiereDepartments: string[]): Student[] => {
    return allStudents.filter(student => filiereDepartments.includes(student.department));
  };
  
  const filteredStudents = (students: Student[]) => {
      if (!searchTerm) return students;
      return students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold">Liste des Étudiants par Filière</h1>
            <p className="text-muted-foreground">Consultez les étudiants regroupés par leur filière d'étude.</p>
         </div>
         <Input
            placeholder="Rechercher dans toutes les listes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
       </div>

      {filieres.map((filiere) => {
        const studentsInFiliere = getStudentsForFiliere(filiere.departments);
        const displayedStudents = filteredStudents(studentsInFiliere);
        
        if(displayedStudents.length === 0 && searchTerm) return null;

        return (
          <Card key={filiere.name}>
            <CardHeader>
              <CardTitle>{filiere.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsInFiliere.length > 0 ? (
                 <StudentTable data={displayedStudents} />
              ) : (
                <p className="text-muted-foreground text-center py-4">Aucun étudiant n'est inscrit dans cette filière.</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
