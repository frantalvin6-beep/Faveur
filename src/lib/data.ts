

import type { Student, Faculty, Department, Course, AcademicRecord, CourseRecord, CourseAssignment, ScheduleEntry, ExamGrade, ExamSchedule, TeacherWorkload, TeacherAttendance, Message, StudentFinance, FacultyFinance, AdminStaff, AdminFinance, AccountingTransaction, Chapter, AcademicEvent, EventType } from './types';
import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, addDoc } from 'firebase/firestore';


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
    // Ensure new students have default values for gpa and academicHistory
    const studentWithDefaults = {
        ...studentData,
        gpa: 0,
        academicHistory: [],
    };
    const docRef = await addDoc(collection(db, 'students'), studentWithDefaults);
    const newStudent: Student = { ...studentWithDefaults, id: docRef.id };
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
    const docRef = await addDoc(collection(db, 'faculty'), facultyMember);
    const newFaculty = { ...facultyMember, id: docRef.id };
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
    const docRef = await addDoc(collection(db, 'departments'), department);
    const newDepartment = { ...department, id: docRef.id };
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

export async function addCourse(courseData: Omit<Course, 'code'>): Promise<Course> {
    // Generate a more robust code
    const baseCode = `${courseData.name.substring(0, 3).toUpperCase()}${courseData.level.charAt(0)}${courseData.level.slice(-1)}`;
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newCode = `${baseCode}-${randomSuffix}`;

    const docRef = doc(db, 'courses', newCode);
    await setDoc(docRef, courseData);
    return { ...courseData, code: newCode };
}


export async function updateCourse(code: string, data: Partial<Course>): Promise<void> {
    const courseRef = doc(db, 'courses', code);
    await updateDoc(courseRef, data);
}


export async function deleteCourse(code: string): Promise<void> {
    await deleteDoc(doc(db, 'courses', code));
}

// --- ACADEMIC CALENDAR SERVICES ---
export async function getAcademicEvents(): Promise<AcademicEvent[]> {
    const snapshot = await getDocs(collection(db, 'academicEvents'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicEvent));
}

export async function addAcademicEvent(event: Omit<AcademicEvent, 'id'>): Promise<AcademicEvent> {
    const docRef = await addDoc(collection(db, 'academicEvents'), event);
    return { ...event, id: docRef.id };
}

export async function deleteAcademicEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, 'academicEvents', id));
}


// --- EXAM GRADES SERVICES ---

export async function getExamGrades(): Promise<ExamGrade[]> {
    const snapshot = await getDocs(collection(db, 'examGrades'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamGrade));
}

export async function addExamGrade(grade: Omit<ExamGrade, 'id'>): Promise<ExamGrade> {
    const docRef = await addDoc(collection(db, 'examGrades'), grade);
    const newGrade = { ...grade, id: docRef.id };
    return newGrade;
}

export async function updateExamGrade(id: string, data: Partial<ExamGrade>): Promise<void> {
    await updateDoc(doc(db, 'examGrades', id), data);
}

export async function deleteExamGrade(id: string): Promise<void> {
    await deleteDoc(doc(db, 'examGrades', id));
}

// --- EXAM SCHEDULE SERVICES ---
export async function getExamSchedules(): Promise<ExamSchedule[]> {
    const snapshot = await getDocs(collection(db, 'examSchedules'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamSchedule));
}

export async function addExamSchedule(exam: Omit<ExamSchedule, 'id'>): Promise<ExamSchedule> {
    const docRef = await addDoc(collection(db, 'examSchedules'), exam);
    return { ...exam, id: docRef.id };
}

export async function deleteExamSchedule(id: string): Promise<void> {
    await deleteDoc(doc(db, 'examSchedules', id));
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
    const docRef = await addDoc(collection(db, 'courseAssignments'), assignment);
    const newAssignment = { ...assignment, id: docRef.id };
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
    const docRef = await addDoc(collection(db, 'schedule'), entry);
    const newEntry = { ...entry, id: docRef.id };
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
    const docRef = await addDoc(collection(db, 'teacherWorkload'), workload);
    const newWorkload = { ...workload, id: docRef.id };
    return newWorkload;
}

export async function updateTeacherWorkload(id: string, data: Partial<TeacherWorkload>): Promise<void> {
    await updateDoc(doc(db, 'teacherWorkload', id), data);
}

export async function deleteTeacherWorkload(id: string): Promise<void> {
    await deleteDoc(doc(db, 'teacherWorkload', id));
}

export async function deleteTeacherWorkloadByCourseAndTeacher(courseCode: string, teacherId: string): Promise<void> {
    const q = query(
        collection(db, 'teacherWorkload'), 
        where('courseCode', '==', courseCode), 
        where('teacherId', '==', teacherId)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}

// --- TEACHER ATTENDANCE SERVICES ---
export async function getTeacherAttendance(): Promise<TeacherAttendance[]> {
    const snapshot = await getDocs(collection(db, 'teacherAttendance'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherAttendance));
}

export async function addTeacherAttendance(attendance: Omit<TeacherAttendance, 'id'>): Promise<TeacherAttendance> {
    const docRef = await addDoc(collection(db, 'teacherAttendance'), attendance);
    const newAttendance = { ...attendance, id: docRef.id };

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
    const docRef = await addDoc(collection(db, 'accountingTransactions'), transaction);
    const newTransaction = { ...transaction, id: docRef.id };
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

// --- ADMIN STAFF SERVICES ---

export async function getAdminStaff(): Promise<AdminStaff[]> {
    const snapshot = await getDocs(collection(db, 'adminStaff'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminStaff));
}

export async function addAdminStaff(staffMember: Omit<AdminStaff, 'id'>): Promise<AdminStaff> {
    const docRef = await addDoc(collection(db, 'adminStaff'), staffMember);
    const newStaff = { ...staffMember, id: docRef.id };
    return newStaff;
}

export async function updateAdminStaff(id: string, data: Partial<AdminStaff>): Promise<void> {
    await updateDoc(doc(db, 'adminStaff', id), data);
}

export async function deleteAdminStaff(id: string): Promise<void> {
    await deleteDoc(doc(db, 'adminStaff', id));
}


export async function addAdminFinance(finance: AdminFinance): Promise<void> {
    await setDoc(doc(db, 'adminFinances', finance.matricule), finance);
}

export async function updateAdminFinance(matricule: string, data: Partial<AdminFinance>): Promise<void> {
    await updateDoc(doc(db, 'adminFinances', matricule), data);
}


// --- MOCK DATA FOR SEEDING ---
export const students_data: Omit<Student, 'id'>[] = [
  { 
    name: 'Alice Dubois', 
    email: 'alice.dubois@campus.edu', 
    gender: 'Féminin',
    department: 'Intelligence Artificielle (IA)', 
    year: 3, 
    gpa: 15.5, 
    enrollmentDate: '2021-09-01',
    academicHistory: [
      { semester: 'Semestre 1', year: 2021, courses: [{name: 'Algorithmique 1', grade: 16, coefficient: 3}, {name: 'Mathématiques Discrètes', grade: 15, coefficient: 2}], gpa: 15.6, decision: 'Admis' },
    ]
  },
  { 
    name: 'Bob Leclerc', 
    email: 'bob.leclerc@campus.edu', 
    gender: 'Masculin',
    department: 'Électronique', 
    year: 2, 
    gpa: 13.2, 
    enrollmentDate: '2022-09-01',
    academicHistory: []
  },
];

export const faculty_data: Omit<Faculty, 'id'>[] = [
  { name: 'Dr. Alain Turing', email: 'alain.turing@campus.edu', phone: '+237699887766', department: 'Intelligence Artificielle (IA)', position: 'Professeur', specialization: 'Apprentissage Profond', teachingLevels: ['Master', 'Licence'], hireDate: '2018-08-15' },
  { name: 'Dr. Ada Lovelace', email: 'ada.lovelace@campus.edu', phone: '+237677665544', department: 'Électronique', position: 'Professeur agrégé', specialization: 'Systèmes Embarqués', teachingLevels: ['Licence'], hireDate: '2020-07-20' },
];

export const departments_data: Omit<Department, 'id'>[] = [
    { name: 'Faculté des Sciences et Technologies', head: 'Pr. Dumbledore', facultyCount: 0, studentCount: 0, creationDate: '2015-01-10' },
    { name: 'Département IA et Robotique', head: 'Dr. Eva Correia', facultyCount: 0, studentCount: 0, creationDate: '2020-01-15', parentId: 'FAC01' },
    { name: 'Intelligence Artificielle (IA)', head: 'Dr. Eva Correia', facultyCount: 0, studentCount: 0, creationDate: '2020-01-15', parentId: 'DEP01' },
    { name: 'Département Génie Électrique', head: 'Dr. Marc Dubois', facultyCount: 0, studentCount: 0, creationDate: '2018-05-20', parentId: 'FAC01' },
    { name: 'Électronique', head: 'Dr. Marc Dubois', facultyCount: 0, studentCount: 0, creationDate: '2018-05-20', parentId: 'DEP02' },
];

export const courses_data: Course[] = [
    { 
        code: 'IA301', 
        name: 'Réseaux de Neurones', 
        department: 'Intelligence Artificielle (IA)', 
        level: 'Licence 3', 
        semester: 'Semestre 5', 
        credits: 5,
        chapters: [
            { id: 'CH-IA301-1', title: 'Introduction aux Perceptrons', subChapters: [{title: 'Perceptron Simple'}, {title: 'Perceptron Multi-couches'}], estimatedDuration: '4h'},
            { id: 'CH-IA301-2', title: 'Rétropropagation du Gradient', subChapters: [{title: 'Descente de gradient'}, {title: 'Fonctions d\'activation'}], estimatedDuration: '6h'}
        ],
        teacherIds: ['PROF001']
    },
    { 
        code: 'ELN202', 
        name: 'Circuits Logiques', 
        department: 'Électronique', 
        level: 'Licence 2', 
        semester: 'Semestre 3', 
        credits: 4,
        chapters: [
            { id: 'CH-ELN202-1', title: 'Portes Logiques', subChapters: [{title: 'AND, OR, NOT'}, {title: 'XOR, NAND, NOR'}], estimatedDuration: '3h'},
        ],
        teacherIds: ['PROF002']
    },
];

export let accountingTransactions: AccountingTransaction[] = [];

export const studentFinancesData: Omit<StudentFinance, 'scolariteCalculee' | 'totalAPayer' | 'reste' | 'statut'>[] = [
    { matricule: 'ETU001', fullName: 'Alice Dubois', level: 'Licence 3', option: 'Intelligence Artificielle (IA)', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 498000 },
    { matricule: 'ETU002', fullName: 'Bob Leclerc', level: 'Licence 2', option: 'Électronique', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 250000 },
];


export let adminStaff_data: Omit<AdminStaff, 'id'>[] = [
    { name: 'Jean Dupont', email: 'jean.dupont@campus.com', role: 'Secrétaire Général', phone: '+33612345678', status: 'Actif', hireDate: '2015-03-01'},
    { name: 'Marie Curie', email: 'marie.curie@campus.com', role: 'Responsable Financier', phone: '+33612345678', status: 'Actif', hireDate: '2018-07-23'},
];

export let messages: Message[] = [];
export let examSchedule: ExamSchedule[] = [];


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
    try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        if (snapshot.empty) {
            console.log(`Collection ${collectionName} is already empty.`);
            return;
        }
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Collection ${collectionName} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting collection ${collectionName}:`, error);
        throw error;
    }
}


export async function seedDatabase() {
    const collectionsToDelete = [
        'students', 'faculty', 'departments', 'courses', 'studentFinances',
        'adminStaff', 'courseAssignments', 'schedule', 'examGrades', 'teacherWorkload',
        'teacherAttendance', 'accountingTransactions', 'facultyFinances', 'adminFinances',
        'academicEvents', 'examSchedules'
    ];

    console.log("Starting database seed process...");
    for (const collectionName of collectionsToDelete) {
        await deleteCollection(collectionName);
    }
    
    console.log("All collections deleted. Starting to write new data...");
    const batch = writeBatch(db);

    const studentDocs = students_data.map(student => {
        const docRef = doc(collection(db, "students"));
        batch.set(docRef, { ...student, id: docRef.id });
        return { ...student, id: docRef.id };
    });

    const facultyDocs = faculty_data.map(facultyMember => {
        const docRef = doc(collection(db, "faculty"));
        batch.set(docRef, { ...facultyMember, id: docRef.id });
        return { ...facultyMember, id: docRef.id };
    });
    
    departments_data.forEach(department => {
        const docRef = doc(collection(db, "departments"));
        batch.set(docRef, {...department, id: docRef.id});
    });

    courses_data.forEach(course => {
        const docRef = doc(db, "courses", course.code);
        const teacherIds = facultyDocs.filter(f => course.teacherIds?.includes(f.name)).map(f => f.id);
        batch.set(docRef, {...course, teacherIds});
    });

    studentFinances_data.forEach(finance => {
        const student = studentDocs.find(s => s.name === finance.fullName);
        if (student) {
            const docRef = doc(db, "studentFinances", student.id);
            batch.set(docRef, {...finance, matricule: student.id});
        }
    });

    const adminStaffDocs = adminStaff_data.map(staff => {
        const docRef = doc(collection(db, "adminStaff"));
        batch.set(docRef, {...staff, id: docRef.id});
        return {...staff, id: docRef.id};
    });

    const initialAcademicEvents: Omit<AcademicEvent, 'id'>[] = [
      { date: '2024-09-02', event: 'Rentrée universitaire', type: 'event' as const },
      { date: '2024-10-28', event: 'Vacances de la Toussaint', type: 'holiday' as const },
      { date: '2024-11-03', event: 'Fin des vacances de la Toussaint', type: 'holiday' as const },
      { date: '2024-12-16', event: 'Début des examens', type: 'exam' as const },
      { date: '2024-12-23', event: 'Vacances de Noël', type: 'holiday' as const },
    ];
    initialAcademicEvents.forEach(event => {
        const docRef = doc(collection(db, "academicEvents"));
        batch.set(docRef, event);
    });


    await batch.commit();
    console.log("Database seeded successfully!");
}

// Export event type for use in components
export type { EventType, AcademicEvent };
