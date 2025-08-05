export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  gpa: number;
  enrollmentDate: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  position: 'Professeur' | 'Professeur agrégé' | 'Professeur assistant' | 'Chargé de cours';
  specialization: string;
  hireDate: string;
}
