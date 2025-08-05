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
  position: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer';
  specialization: string;
  hireDate: string;
}
