

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
    parentId?: string;
}

export interface Course {
  code: string;
  name: string;
  department: string;
  level: string;
  semester: string;
  credits: number;
  chapters: Chapter[];
  teacherIds?: string[];
}

export interface Chapter {
    id: string;
    title: string;
    subChapters: { title: string }[];
    estimatedDuration: string;
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
  teacherId: string;
  teacherName: string;
  department: string;
  level: string;
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

export interface ProgramStatus {
    chapter: string;
    lessons: string[];
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  teacherName: string;
  courseName: string;
  courseCode: string;
  date: string;
  status: 'Présent' | 'Absent' | 'Justifié';
  programStatus?: ProgramStatus;
  remarks?: string;
}

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

export interface StudentFinance {
  matricule: string;
  fullName: string;
  level: string;
  option: string;
  inscription: number;
  semester: 'Pair' | 'Impair';
  fournitures: number;
  support: number;
  bourseType: 'Non boursier' | 'Boursier' | 'Partiellement boursier';
  reduction: number;
  scolariteBase: number;
  scolariteCalculee: number;
  latrine: number;
  session: number;
  rattrapage: number;
  totalAPayer: number;
  avance: number;
  reste: number;
  statut: 'Finalisé' | 'Non finalisé';
}

export interface FacultyFinance {
    teacherId: string;
    fullName: string;
    departement: string;
    heuresL1: number;
    tauxL1: number;
    heuresL2: number;
    tauxL2: number;
    heuresL3: number;
    tauxL3: number;
    heuresMaster: number;
    tauxMaster: number;
    totalAPayer: number;
    montantPaye: number;
    reste: number;
    statut: 'Finalisé' | 'Non finalisé';
}

export interface AdminStaff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Actif' | 'Suspendu';
  hireDate: string;
}

export interface AdminFinance {
  matricule: string;
  fullName: string;
  poste: string;
  salaireMensuel: number;
  indemniteTransport: number;
  autresAvantages: number;
  totalAPayer: number;
  montantPaye: number;
  reste: number;
  statut: 'Finalisé' | 'Non finalisé';
}

export interface AccountingTransaction {
  id: string;
  date: string;
  type: 'Revenu' | 'Dépense';
  sourceBeneficiary: string;
  category: string;
  amount: number;
  paymentMethod: 'Espèces' | 'Virement bancaire' | 'Chèque';
  description: string;
  responsible: string;
}

export type EventType = 'event' | 'exam' | 'holiday';

export interface AcademicEvent {
    id: string;
    date: string;
    event: string;
    type: EventType;
}

export type UserRole = 'Admin' | 'Enseignant' | 'Étudiant' | 'Promoteur' | 'DAC' | 'DAF' | 'Secrétaire' | 'Surveillant' | 'Professeur';


// --- MARKETING & PRE-REGISTRATION ---

export interface MarketingContent {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageHint?: string;
}

export interface PreRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  fieldOfInterest: string;
  status: 'En attente' | 'Validé' | 'Rejeté';
  date: string;
}
