

import type { Student, Faculty, Department, Course, AcademicRecord, CourseRecord, CourseAssignment, ScheduleEntry, ExamGrade, ExamSchedule, TeacherWorkload, TeacherAttendance, Message, StudentFinance, FacultyFinance, AdminStaff, AdminFinance, AccountingTransaction, Chapter } from './types';
import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';


// --- STUDENT DATA SERVICES ---

export async function getStudents(): Promise<Student[]> {
    const snapshot = await getDocs(collection(db, 'students'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
}

export async function getStudent(id: string): Promise<Student | null> {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Student : null;
}

export async function addStudent(studentData: Omit<Student, 'id'>): Promise<Student> {
    // Generate a new document reference with a unique ID
    const newStudentRef = doc(collection(db, 'students'));
    const newStudent = { ...studentData, id: newStudentRef.id };
    await setDoc(newStudentRef, newStudent);
    return newStudent;
}


export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
    await updateDoc(doc(db, 'students', id), data);
}

export async function deleteStudent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'students', id));
}


// --- FACULTY DATA SERVICES ---

export async function getFaculty(): Promise<Faculty[]> {
    const snapshot = await getDocs(collection(db, 'faculty'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty));
}

export async function addFaculty(facultyMember: Omit<Faculty, 'id'>): Promise<Faculty> {
    const docRef = doc(collection(db, 'faculty'));
    const newFaculty = { ...facultyMember, id: docRef.id };
    await setDoc(docRef, newFaculty);
    return newFaculty;
}

export async function updateFaculty(id: string, data: Partial<Faculty>): Promise<void> {
    await updateDoc(doc(db, 'faculty', id), data);
}

export async function deleteFaculty(id: string): Promise<void> {
    await deleteDoc(doc(db, 'faculty', id));
}

// --- DEPARTMENT DATA SERVICES ---

export async function getDepartments(): Promise<Department[]> {
    const snapshot = await getDocs(collection(db, 'departments'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
}

export async function addDepartment(department: Omit<Department, 'id' | 'parentId'> & { parentId?: string }): Promise<Department> {
    const docRef = doc(collection(db, 'departments'));
    
    // Construct the final ID
    const id = department.parentId 
      ? `${department.parentId}-OPT${docRef.id.slice(-4)}`
      : `DEP${docRef.id.slice(-4)}`;

    const newDepartment: Department = {
        ...department,
        id: id,
    };
    // remove parentId before saving
    delete (newDepartment as any).parentId;

    await setDoc(doc(db, 'departments', id), newDepartment);
    return newDepartment;
}

export async function deleteDepartment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'departments', id));
}

// --- COURSE DATA SERVICES ---

export async function getCourses(): Promise<Course[]> {
    const snapshot = await getDocs(collection(db, 'courses'));
    return snapshot.docs.map(doc => ({ code: doc.id, ...doc.data() } as Course));
}

export async function addCourse(course: Course): Promise<Course> {
    await setDoc(doc(db, 'courses', course.code), course);
    return course;
}

export async function updateCourse(code: string, data: Partial<Course>): Promise<void> {
    await updateDoc(doc(db, 'courses', code), data);
}

export async function deleteCourse(code: string): Promise<void> {
    await deleteDoc(doc(db, 'courses', code));
}


// --- FINANCIAL DATA SERVICES (Student) ---
export async function getStudentFinances(): Promise<StudentFinance[]> {
    const snapshot = await getDocs(collection(db, 'studentFinances'));
    return snapshot.docs.map(doc => doc.data() as StudentFinance);
}

export async function addStudentFinance(finance: StudentFinance): Promise<void> {
    await setDoc(doc(db, 'studentFinances', finance.matricule), finance);
}

export async function updateStudentFinance(matricule: string, data: Partial<StudentFinance>): Promise<void> {
    await updateDoc(doc(db, 'studentFinances', matricule), data);
}


// --- MOCK DATA FOR SEEDING (to be removed later) ---
export const students_data: Student[] = [
  { 
    id: 'S001', 
    name: 'Alice Johnson', 
    email: 'alice.j@university.edu', 
    gender: 'Féminin',
    department: 'Intelligence Artificielle (IA)', 
    year: 3, 
    gpa: 3.8, 
    enrollmentDate: '2021-09-01',
    academicHistory: [
      { semester: 'Semestre 1', year: 2021, courses: [{name: 'Algo 1', grade: 18, coefficient: 3}, {name: 'Maths 1', grade: 17, coefficient: 2}], gpa: 17.6, decision: 'Admis' },
      { semester: 'Semestre 2', year: 2022, courses: [{name: 'Algo 2', grade: 16, coefficient: 3}, {name: 'Web 1', grade: 18, coefficient: 2}], gpa: 16.8, decision: 'Admis' },
    ]
  },
  { 
    id: 'S002', 
    name: 'Bob Smith', 
    email: 'bob.s@university.edu', 
    gender: 'Masculin',
    department: 'Électronique', 
    year: 2, 
    gpa: 3.5, 
    enrollmentDate: '2022-09-01',
    academicHistory: [
        { semester: 'Semestre 1', year: 2022, courses: [{name: 'Electronique 1', grade: 15, coefficient: 4}, {name: 'Automatique', grade: 14, coefficient: 3}], gpa: 14.57, decision: 'Admis' },
    ]
  },
];

export const faculty_data: Faculty[] = [
  { id: 'F001', name: 'Dr. Alan Grant', email: 'alan.g@university.edu', phone: '+1-202-555-0191', department: 'Intelligence Artificielle (IA)', position: 'Professeur', specialization: 'Machine Learning, NLP', teachingLevels: ['Master', 'Doctorat'], hireDate: '2010-08-15' },
  { id: 'F002', name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', phone: '+1-202-555-0143', department: 'Électronique', position: 'Professeur agrégé', specialization: 'Systèmes embarqués, IoT', teachingLevels: ['Licence', 'Master'], hireDate: '2015-07-20' },
];

export const departments_data: Department[] = [
    { id: 'DEP01', name: 'Département IA et Robotique', head: 'Dr. Eva Correia', facultyCount: 40, studentCount: 450, creationDate: '2020-01-15' },
    { id: 'DEP01-OPT02', name: 'Intelligence Artificielle (IA)', head: 'Dr. Eva Correia', facultyCount: 15, studentCount: 150, creationDate: '2020-01-15' },
    { id: 'DEP02', name: 'Département Génie Électrique et Informatique Industrielle', head: 'Dr. Marc Dubois', facultyCount: 55, studentCount: 600, creationDate: '2018-05-20' },
    { id: 'DEP02-OPT01', name: 'Électronique', head: 'Dr. Marc Dubois', facultyCount: 20, studentCount: 200, creationDate: '2018-05-20' },
];

export const courses_data: Course[] = [
    { 
        code: 'CS101', 
        name: 'Introduction à la Programmation', 
        department: 'Programmation', 
        level: 'Licence 1', 
        semester: 'Semestre 1', 
        credits: 5,
        chapters: [],
        teacherIds: ['F003']
    },
    { 
        code: 'AI201', 
        name: 'Fondamentaux de l\'IA', 
        department: 'Intelligence Artificielle (IA)', 
        level: 'Licence 2', 
        semester: 'Semestre 3', 
        credits: 4,
        chapters: [],
        teacherIds: ['F001']
    },
];

const studentFinancesData: Omit<StudentFinance, 'scolariteCalculee' | 'totalAPayer' | 'reste' | 'statut'>[] = [
    { matricule: 'S001', fullName: 'Alice Johnson', level: 'Licence 3', option: 'Intelligence Artificielle (IA)', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 498000 },
    { matricule: 'S002', fullName: 'Bob Smith', level: 'Licence 2', option: 'Électronique', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 250000 },
];

// Re-export original functions with temporary mock data for other pages
export const scheduleData: ScheduleEntry[] = [];
export const examGrades: ExamGrade[] = [];
export const examSchedule: ExamSchedule[] = [];
export const teacherWorkload: TeacherWorkload[] = [];
export const teacherAttendance: TeacherAttendance[] = [];
export const messages: Message[] = [];
export const adminStaff: AdminStaff[] = [];
export const facultyFinances: FacultyFinance[] = [];
export const adminFinances: AdminFinance[] = [];
export const accountingTransactions: AccountingTransaction[] = [];
export const courseAssignments: CourseAssignment[] = [];
export const faculty: Faculty[] = faculty_data;
export const departments: Department[] = departments_data;


// --- UTILITY FUNCTIONS ---
export function calculerFinance(
  inscription: number, fournitures: number, support: number, 
  bourseType: StudentFinance['bourseType'], reduction: number, scolariteBase: number,
  latrine: number, session: number, rattrapage: number, avance: number
) {
  let scolariteCalculee = 0;

  if (bourseType === "Boursier") {
    scolariteCalculee = 0;
  } else if (bourseType === "Partiellement boursier") {
    scolariteCalculee = scolariteBase - (scolariteBase * reduction / 100);
  } else {
    scolariteCalculee = scolariteBase;
  }

  const totalAPayer = inscription + fournitures + support + scolariteCalculee + latrine + session + rattrapage;
  const reste = totalAPayer - avance;
  const statut: StudentFinance['statut'] = reste <= 0 ? "Finalisé" : "Non finalisé";

  return { scolariteCalculee, totalAPayer, reste, statut };
}

export const studentFinances_data: StudentFinance[] = studentFinancesData.map(data => {
    const calculated = calculerFinance(
        data.inscription, data.fournitures, data.support, data.bourseType,
        data.reduction, data.scolariteBase, data.latrine, data.session,
        data.rattrapage, data.avance
    );
    return { ...data, ...calculated };
});

export async function getStudentFinanceStatusByName(studentName: string): Promise<{ status: string }> {
  const finances = await getStudentFinances();
  const student = finances.find(
    (s) => s.fullName.toLowerCase() === studentName.toLowerCase()
  );

  if (!student) {
    return { status: `L'étudiant nommé "${studentName}" n'a pas été trouvé dans les archives financières.` };
  }
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

  if (student.statut === 'Finalisé') {
    return { status: `Oui, les frais de scolarité pour ${studentName} sont finalisés. Le solde est de 0.` };
  } else {
    return { status: `Non, les frais pour ${studentName} ne sont pas finalisés. Il reste un montant de ${formatCurrency(student.reste)} à payer.` };
  }
}

export function calculerComptabilite(transactions: AccountingTransaction[]) {
  let revenus = 0;
  let depenses = 0;

  transactions.forEach(t => {
    if (t.type === "Revenu") revenus += t.amount;
    else if (t.type === "Dépense") depenses += t.amount;
  });

  return { revenus, depenses, solde: revenus - depenses };
}

export function calculerSalaireComplet(
    teacherId: string,
    montantPaye: number,
    tauxL1: number,
    tauxL2: number,
    tauxL3: number,
    tauxMaster: number
) {
    const teacherWorkloads = teacherWorkload.filter(w => w.teacherId === teacherId);

    const getHoursForLevel = (levelPrefix: string) => 
        teacherWorkloads.filter(w => w.level.startsWith(levelPrefix)).reduce((sum, w) => sum + w.completedHours, 0);

    const heuresL1 = getHoursForLevel('Licence 1');
    const heuresL2 = getHoursForLevel('Licence 2');
    const heuresL3 = getHoursForLevel('Licence 3');
    const heuresMaster = getHoursForLevel('Master');

    const totalAPayer =
        (heuresL1 * tauxL1) +
        (heuresL2 * tauxL2) +
        (heuresL3 * tauxL3) +
        (heuresMaster * tauxMaster);

    const reste = totalAPayer - montantPaye;
    const statut: FacultyFinance['statut'] = reste <= 0 ? "Finalisé" : "Non finalisé";

    return { heuresL1, heuresL2, heuresL3, heuresMaster, totalAPayer, reste, statut };
}
export function calculerFinanceAdmin(
  salaire: number, transport: number, avantages: number, montantPaye: number
) {
  const totalAPayer = salaire + transport + avantages;
  const reste = totalAPayer - montantPaye;
  const statut: AdminFinance['statut'] = reste <= 0 ? "Finalisé" : "Non finalisé";

  return { totalAPayer, reste, statut };
}

// In a real app, initial data would be fetched, but here we modify it in-memory
// These are now obsolete and will be removed once all pages are migrated.
export const initialCourses = courses_data;
export const initialStudents = students_data;
