export interface Student {
  id: string;
  name: string;
  email: string;
  gender: 'Masculin' | 'Féminin';
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
  phone: string;
  department: string;
  position: 'Professeur' | 'Professeur agrégé' | 'Professeur assistant' | 'Chargé de cours';
  specialization: string;
  teachingLevels: ('Licence' | 'Master' | 'Doctorat')[];
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
  coefficient: number;
}

export interface CourseAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  courseName: string;
  courseCode: string;
  department: string;
  level: string;
  semester: string;
  hourlyVolume: number;
}

export interface ScheduleEntry {
  id: string;
  teacherId: string;
  teacherName: string;
  courseName: string;
  courseCode: string;
  dayOfWeek: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  startTime: string;
  endTime: string;
  location: string;
  level: string;
  semester: string;
}

export interface ExamGrade {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  department: string;
  examType: 'Contrôle' | 'Partiel' | 'Final';
  grade: number;
  coefficient: number;
  date: string;
}

export interface ExamSchedule {
    id: string;
    date: string;
    time: string;
    courseName: string;
    supervisor: string;
    room: string;
    level: string;
    examType: 'Contrôle' | 'Partiel' | 'Final' | 'Rattrapage';
}

export interface TeacherWorkload {
    id: string;
    teacherId: string;
    teacherName: string;
    courseName: string;
    level: string;
    semester: string;
    plannedHours: number;
    completedHours: number;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  teacherName: string;
  courseName: string;
  courseCode: string;
  date: string;
  status: 'Présent' | 'Absent' | 'Justifié';
  remarks?: string;
}

export type UserRole = 'Admin' | 'Enseignant' | 'Étudiant';

export interface Message {
  id: string;
  sender: {
    name: string;
    role: UserRole;
  };
  recipients: {
    name: string;
    role: UserRole;
  }[];
  subject: string;
  body: string;
  attachment?: {
    name: string;
    url: string;
  };
  sentAt: string;
  status: 'Envoyé' | 'Lu' | 'Non lu' | 'Archivé' | 'Supprimé';
}
