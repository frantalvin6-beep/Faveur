

import type { Student, Faculty, Department, Course, AcademicRecord, CourseRecord, CourseAssignment, ScheduleEntry, ExamGrade, ExamSchedule, TeacherWorkload, TeacherAttendance, Message, StudentFinance, FacultyFinance, AdminStaff, AdminFinance, AccountingTransaction, Chapter } from './types';
import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';


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
    // Generate a new ID, but use the provided data to create the document
    const studentWithId: Student = { ...studentData, id: doc(collection(db, 'students')).id, academicHistory: [] };
    // Use the matricule (id) as the document ID in Firestore for easy lookup
    await setDoc(doc(db, 'students', studentWithId.id), studentWithId);
    return studentWithId;
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
    await setDoc(docRef, facultyMember);
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

export async function addDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    const docRef = doc(collection(db, 'departments'));
    const newDepartment = { ...department, id: docRef.id };
    await setDoc(docRef, department);
    return newDepartment;
}

export async function deleteDepartment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'departments', id));
}

// --- COURSE DATA SERVICES ---

export async function getCourses(): Promise<Course[]> {
    const snapshot = await getDocs(collection(db, 'courses'));
    return snapshot.docs.map(doc => ({ ...doc.data(), code: doc.id } as Course));
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

// --- EXAM GRADES SERVICES ---

export async function getExamGrades(): Promise<ExamGrade[]> {
    const snapshot = await getDocs(collection(db, 'examGrades'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamGrade));
}

export async function addExamGrade(grade: Omit<ExamGrade, 'id'>): Promise<ExamGrade> {
    const docRef = doc(collection(db, 'examGrades'));
    const newGrade = { ...grade, id: docRef.id };
    await setDoc(docRef, grade);
    return newGrade;
}

export async function updateExamGrade(id: string, data: Partial<ExamGrade>): Promise<void> {
    await updateDoc(doc(db, 'examGrades', id), data);
}

export async function deleteExamGrade(id: string): Promise<void> {
    await deleteDoc(doc(db, 'examGrades', id));
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

// --- COURSE ASSIGNMENT SERVICES ---
export async function getCourseAssignments(): Promise<CourseAssignment[]> {
    const snapshot = await getDocs(collection(db, 'courseAssignments'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CourseAssignment));
}

export async function addCourseAssignment(assignment: Omit<CourseAssignment, 'id'>): Promise<CourseAssignment> {
    const docRef = doc(collection(db, 'courseAssignments'));
    const newAssignment = { ...assignment, id: docRef.id };
    await setDoc(docRef, assignment);
    return newAssignment;
}

export async function deleteCourseAssignment(id: string): Promise<void> {
    await deleteDoc(doc(db, 'courseAssignments', id));
}

// --- SCHEDULE SERVICES ---
export async function getSchedule(): Promise<ScheduleEntry[]> {
    const snapshot = await getDocs(collection(db, 'schedule'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScheduleEntry));
}

export async function addScheduleEntry(entry: Omit<ScheduleEntry, 'id'>): Promise<ScheduleEntry> {
    const docRef = doc(collection(db, 'schedule'));
    const newEntry = { ...entry, id: docRef.id };
    await setDoc(docRef, entry);
    return newEntry;
}

export async function deleteScheduleEntry(id: string): Promise<void> {
    await deleteDoc(doc(db, 'schedule', id));
}

// --- TEACHER WORKLOAD SERVICES ---
export async function getTeacherWorkloads(): Promise<TeacherWorkload[]> {
    const snapshot = await getDocs(collection(db, 'teacherWorkload'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherWorkload));
}

export async function addTeacherWorkload(workload: Omit<TeacherWorkload, 'id'>): Promise<TeacherWorkload> {
    const docRef = doc(collection(db, 'teacherWorkload'));
    const newWorkload = { ...workload, id: docRef.id };
    await setDoc(docRef, workload);
    return newWorkload;
}

export async function updateTeacherWorkload(id: string, data: Partial<TeacherWorkload>): Promise<void> {
    await updateDoc(doc(db, 'teacherWorkload', id), data);
}

export async function deleteTeacherWorkload(id: string): Promise<void> {
    await deleteDoc(doc(db, 'teacherWorkload', id));
}


// --- TEACHER ATTENDANCE SERVICES ---
export async function getTeacherAttendance(): Promise<TeacherAttendance[]> {
    const snapshot = await getDocs(collection(db, 'teacherAttendance'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherAttendance));
}

export async function addTeacherAttendance(attendance: Omit<TeacherAttendance, 'id'>): Promise<TeacherAttendance> {
    const docRef = doc(collection(db, 'teacherAttendance'));
    const newAttendance = { ...attendance, id: docRef.id };
    await setDoc(docRef, attendance);

    // If present, update workload
    if (newAttendance.status === 'Présent') {
        const schedule = await getSchedule();
        const scheduleEntry = schedule.find(
            s => s.teacherId === newAttendance.teacherId && s.courseCode === newAttendance.courseCode
        );

        if (scheduleEntry) {
            const workloads = await getTeacherWorkloads();
            const workloadQuery = query(collection(db, "teacherWorkload"), where("teacherId", "==", newAttendance.teacherId), where("courseName", "==", scheduleEntry.courseName));
            const workloadSnapshot = await getDocs(workloadQuery);
            
            if (!workloadSnapshot.empty) {
                const workloadDoc = workloadSnapshot.docs[0];
                const currentWorkload = workloadDoc.data() as TeacherWorkload;
                
                const startTime = new Date(`1970-01-01T${scheduleEntry.startTime}:00`);
                const endTime = new Date(`1970-01-01T${scheduleEntry.endTime}:00`);
                const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

                await updateTeacherWorkload(workloadDoc.id, {
                    completedHours: currentWorkload.completedHours + durationInHours
                });
            }
        }
    }
    return newAttendance;
}

export async function deleteTeacherAttendance(id: string): Promise<void> {
    const attendanceDoc = await getDoc(doc(db, 'teacherAttendance', id));
    if (!attendanceDoc.exists()) return;

    const attendanceToDelete = attendanceDoc.data() as TeacherAttendance;

    // Reverse the workload update if the deleted entry was 'Present'
    if (attendanceToDelete.status === 'Présent') {
        const schedule = await getSchedule();
        const scheduleEntry = schedule.find(
            s => s.teacherId === attendanceToDelete.teacherId && s.courseCode === attendanceToDelete.courseCode
        );

        if (scheduleEntry) {
            const workloadQuery = query(collection(db, "teacherWorkload"), where("teacherId", "==", attendanceToDelete.teacherId), where("courseName", "==", scheduleEntry.courseName));
            const workloadSnapshot = await getDocs(workloadQuery);
            if (!workloadSnapshot.empty) {
                const workloadDoc = workloadSnapshot.docs[0];
                const currentWorkload = workloadDoc.data() as TeacherWorkload;

                const startTime = new Date(`1970-01-01T${scheduleEntry.startTime}:00`);
                const endTime = new Date(`1970-01-01T${scheduleEntry.endTime}:00`);
                const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                
                await updateTeacherWorkload(workloadDoc.id, {
                    completedHours: Math.max(0, currentWorkload.completedHours - durationInHours),
                });
            }
        }
    }

    await deleteDoc(doc(db, 'teacherAttendance', id));
}


// --- ACCOUNTING SERVICES ---
export async function getAccountingTransactions(): Promise<AccountingTransaction[]> {
    const snapshot = await getDocs(collection(db, 'accountingTransactions'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccountingTransaction));
}

export async function addAccountingTransaction(transaction: Omit<AccountingTransaction, 'id'>): Promise<AccountingTransaction> {
    const docRef = doc(collection(db, 'accountingTransactions'));
    const newTransaction = { ...transaction, id: docRef.id };
    await setDoc(docRef, transaction);
    return newTransaction;
}

export async function deleteAccountingTransaction(id: string): Promise<void> {
    await deleteDoc(doc(db, 'accountingTransactions', id));
}


// --- FINANCIAL DATA SERVICES (Faculty & Admin) ---
export async function getFacultyFinances(): Promise<FacultyFinance[]> {
    const snapshot = await getDocs(collection(db, 'facultyFinances'));
    return snapshot.docs.map(doc => doc.data() as FacultyFinance);
}

export async function addFacultyFinance(finance: FacultyFinance): Promise<void> {
    await setDoc(doc(db, 'facultyFinances', finance.teacherId), finance);
}

export async function updateFacultyFinance(teacherId: string, data: Partial<FacultyFinance>): Promise<void> {
    await updateDoc(doc(db, 'facultyFinances', teacherId), data);
}

export async function getAdminFinances(): Promise<AdminFinance[]> {
    const snapshot = await getDocs(collection(db, 'adminFinances'));
    return snapshot.docs.map(doc => doc.data() as AdminFinance);
}

export async function getAdminStaff(): Promise<AdminStaff[]> {
    const snapshot = await getDocs(collection(db, 'adminStaff'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminStaff));
}


export async function addAdminFinance(finance: AdminFinance): Promise<void> {
    await setDoc(doc(db, 'adminFinances', finance.matricule), finance);
}

export async function updateAdminFinance(matricule: string, data: Partial<AdminFinance>): Promise<void> {
    await updateDoc(doc(db, 'adminFinances', matricule), data);
}


// --- MOCK DATA FOR SEEDING ---
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
    { id: 'DEP01-OPT02', name: 'Intelligence Artificielle (IA)', head: 'Dr. Eva Correia', facultyCount: 15, studentCount: 150, creationDate: '2020-01-15', parentId: 'DEP01' },
    { id: 'DEP02', name: 'Département Génie Électrique et Informatique Industrielle', head: 'Dr. Marc Dubois', facultyCount: 55, studentCount: 600, creationDate: '2018-05-20' },
    { id: 'DEP02-OPT01', name: 'Électronique', head: 'Dr. Marc Dubois', facultyCount: 20, studentCount: 200, creationDate: '2018-05-20', parentId: 'DEP02' },
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

export let accountingTransactions: AccountingTransaction[] = [];

export const studentFinancesData: Omit<StudentFinance, 'scolariteCalculee' | 'totalAPayer' | 'reste' | 'statut'>[] = [
    { matricule: 'S001', fullName: 'Alice Johnson', level: 'Licence 3', option: 'Intelligence Artificielle (IA)', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 498000 },
    { matricule: 'S002', fullName: 'Bob Smith', level: 'Licence 2', option: 'Électronique', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 250000 },
];


export const adminStaff_data: AdminStaff[] = [
    { id: 'ADM01', name: 'Jean Dupont', email: 'jean.dupont@campus.com', position: 'Secrétaire Général', hireDate: '2015-03-01'},
    { id: 'ADM02', name: 'Marie Curie', email: 'marie.curie@campus.com', position: 'Responsable Financier', hireDate: '2018-07-23'},
];

export const messages: Message[] = [];
export const examSchedule: ExamSchedule[] = [];


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

export function calculerComptabilite(transactions: AccountingTransaction[]) {
  let revenus = 0;
  let depenses = 0;

  transactions.forEach(t => {
    if (t.type === "Revenu") revenus += t.amount;
    else if (t.type === "Dépense") depenses += t.amount;
  });

  return { revenus, depenses, solde: revenus - depenses };
}

export async function calculerSalaireComplet(
    teacherId: string,
    montantPaye: number,
    tauxL1: number,
    tauxL2: number,
    tauxL3: number,
    tauxMaster: number
) {
    const teacherWorkloads = await getTeacherWorkloads();
    const filteredWorkloads = teacherWorkloads.filter(w => w.teacherId === teacherId);

    const getHoursForLevel = (levelPrefix: string) => 
        filteredWorkloads.filter(w => w.level.startsWith(levelPrefix)).reduce((sum, w) => sum + w.completedHours, 0);

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

async function deleteCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}


export async function seedDatabase() {
    const collectionsToDelete = [
        'students', 'faculty', 'departments', 'courses', 'studentFinances',
        'adminStaff', 'courseAssignments', 'schedule', 'examGrades', 'teacherWorkload',
        'teacherAttendance', 'accountingTransactions', 'facultyFinances', 'adminFinances'
    ];

    for (const collectionName of collectionsToDelete) {
        await deleteCollection(collectionName);
    }

    const batch = writeBatch(db);

    students_data.forEach(student => {
        const docRef = doc(db, "students", student.id);
        batch.set(docRef, student);
    });

    faculty_data.forEach(facultyMember => {
        const docRef = doc(db, "faculty", facultyMember.id);
        batch.set(docRef, facultyMember);
    });

    departments_data.forEach(department => {
        const docRef = doc(db, "departments", department.id);
        batch.set(docRef, department);
    });

    courses_data.forEach(course => {
        const docRef = doc(db, "courses", course.code);
        batch.set(docRef, course);
    });

    studentFinances_data.forEach(finance => {
        const docRef = doc(db, "studentFinances", finance.matricule);
        batch.set(docRef, finance);
    });

    adminStaff_data.forEach(staff => {
        const docRef = doc(db, "adminStaff", staff.id);
        batch.set(docRef, staff);
    });

    await batch.commit();
}
