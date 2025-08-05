export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  gpa: number;
  enrollmentDate: string;
  academicHistory: AcademicRecord[];
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

export interface Department {
    id: string;
    name: string;
    head: string;
    facultyCount: number;
    studentCount: number;
    creationDate: string;
}

export interface AcademicRecord {
  semester: string;
  year: number;
  courses: CourseRecord[];
  gpa: number;
  decision: 'Admis' | 'Échec' | 'Redoublant';
}

export interface CourseRecord {
  name: string;
  grade: number;
}
