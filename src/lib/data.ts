import type { Student, Faculty, Department, AcademicRecord, CourseRecord, CourseAssignment, ScheduleEntry, ExamGrade, ExamSchedule, TeacherWorkload, TeacherAttendance, Message, StudentFinance, FacultyFinance, AdminStaff, AdminFinance, AccountingTransaction } from './types';

export const students: Student[] = [
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
  { 
    id: 'S003', 
    name: 'Charlie Brown', 
    email: 'charlie.b@university.edu', 
    gender: 'Masculin',
    department: 'Cybersécurité', 
    year: 4, 
    gpa: 3.9, 
    enrollmentDate: '2020-09-01',
    academicHistory: [] 
  },
  { 
    id: 'S004', 
    name: 'Diana Prince', 
    email: 'diana.p@university.edu', 
    gender: 'Féminin',
    department: 'Architecture et Urbanisme', 
    year: 3, 
    gpa: 3.6, 
    enrollmentDate: '2021-09-01',
    academicHistory: []
  },
  { 
    id: 'S005', 
    name: 'Ethan Hunt', 
    email: 'ethan.h@university.edu', 
    gender: 'Masculin',
    department: 'Big Data', 
    year: 1, 
    gpa: 3.2, 
    enrollmentDate: '2023-09-01',
    academicHistory: []
  },
  { 
    id: 'S006', 
    name: 'Fiona Glenanne', 
    email: 'fiona.g@university.edu', 
    gender: 'Féminin',
    department: 'Ressources Humaines axées Digital', 
    year: 2, 
    gpa: 3.7, 
    enrollmentDate: '2022-09-01',
    academicHistory: []
  },
  { 
    id: 'S007', 
    name: 'George Costanza', 
    email: 'george.c@university.edu', 
    gender: 'Masculin',
    department: 'Mécatronique', 
    year: 4, 
    gpa: 3.1, 
    enrollmentDate: '2020-09-01',
    academicHistory: []
  },
];

export const faculty: Faculty[] = [
  { id: 'F001', name: 'Dr. Alan Grant', email: 'alan.g@university.edu', phone: '+1-202-555-0191', department: 'Intelligence Artificielle (IA)', position: 'Professeur', specialization: 'Machine Learning, NLP', teachingLevels: ['Master', 'Doctorat'], hireDate: '2010-08-15' },
  { id: 'F002', name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', phone: '+1-202-555-0143', department: 'Électronique', position: 'Professeur agrégé', specialization: 'Systèmes embarqués, IoT', teachingLevels: ['Licence', 'Master'], hireDate: '2015-07-20' },
  { id: 'F003', name: 'Dr. Ian Malcolm', email: 'ian.m@university.edu', phone: '+1-202-555-0111', department: 'Big Data', position: 'Professeur', specialization: 'Analyse de données, Modélisation', teachingLevels: ['Licence', 'Master'], hireDate: '2012-01-10' },
  { id: 'F004', name: 'Dr. Sarah Harding', email: 'sarah.h@university.edu', phone: '+1-202-555-0189', department: 'Architecture et Urbanisme', position: 'Professeur assistant', specialization: 'Urbanisme durable, CAO', teachingLevels: ['Licence'], hireDate: '2018-09-01' },
  { id: 'F005', name: 'Dr. John Hammond', email: 'john.h@university.edu', phone: '+1-202-555-0154', department: 'Ressources Humaines axées Digital', position: 'Chargé de cours', specialization: 'Management digital, SIRH', teachingLevels: ['Licence', 'Master'], hireDate: '2020-02-25' },
];

export const departments: Department[] = [
    { id: 'DEP01', name: 'Département IA et Robotique', head: 'Dr. Eva Correia', facultyCount: 40, studentCount: 450, creationDate: '2020-01-15' },
    { id: 'DEP01-OPT01', name: 'Big Data', head: 'Dr. Eva Correia', facultyCount: 10, studentCount: 100, creationDate: '2020-01-15' },
    { id: 'DEP01-OPT02', name: 'Intelligence Artificielle (IA)', head: 'Dr. Eva Correia', facultyCount: 15, studentCount: 150, creationDate: '2020-01-15' },
    { id: 'DEP01-OPT03', name: 'Programmation', head: 'Dr. Eva Correia', facultyCount: 10, studentCount: 120, creationDate: '2020-01-15' },
    { id: 'DEP01-OPT04', name: 'Mécatronique', head: 'Dr. Eva Correia', facultyCount: 5, studentCount: 80, creationDate: '2020-01-15' },

    { id: 'DEP02', name: 'Département Génie Électrique et Informatique Industrielle', head: 'Dr. Marc Dubois', facultyCount: 55, studentCount: 600, creationDate: '2018-05-20' },
    { id: 'DEP02-OPT01', name: 'Électronique', head: 'Dr. Marc Dubois', facultyCount: 20, studentCount: 200, creationDate: '2018-05-20' },
    { id: 'DEP02-OPT02', name: 'Électrotechnique', head: 'Dr. Marc Dubois', facultyCount: 20, studentCount: 200, creationDate: '2018-05-20' },
    { id: 'DEP02-OPT03', name: 'Maintenance Industrielle', head: 'Dr. Marc Dubois', facultyCount: 15, studentCount: 200, creationDate: '2018-05-20' },
    
    { id: 'DEP03', name: 'Département Génie Informatique', head: 'Dr. Ken Thompson', facultyCount: 50, studentCount: 550, creationDate: '2019-09-10' },
    { id: 'DEP03-OPT01', name: 'Réseaux et Télécommunications', head: 'Dr. Ken Thompson', facultyCount: 20, studentCount: 250, creationDate: '2019-09-10' },
    { id: 'DEP03-OPT02', name: 'Cybersécurité', head: 'Dr. Ken Thompson', facultyCount: 20, studentCount: 200, creationDate: '2019-09-10' },
    { id: 'DEP03-OPT03', name: 'Maintenance Informatique', head: 'Dr. Ken Thompson', facultyCount: 10, studentCount: 100, creationDate: '2019-09-10' },
    
    { id: 'DEP04', name: 'Filière Génie Civil', head: 'M. Imhotep', facultyCount: 30, studentCount: 300, creationDate: '2017-03-15' },
    { id: 'DEP04-OPT01', name: 'Architecture et Urbanisme', head: 'M. Imhotep', facultyCount: 30, studentCount: 300, creationDate: '2017-03-15' },

    { id: 'DEP05', name: 'Filière Digital Business', head: 'Mme. Sheryl Sandberg', facultyCount: 25, studentCount: 250, creationDate: '2021-08-01' },
    { id: 'DEP05-OPT01', name: 'Ressources Humaines axées Digital', head: 'Mme. Sheryl Sandberg', facultyCount: 25, studentCount: 250, creationDate: '2021-08-01' },
];

export const courseAssignments: CourseAssignment[] = [
    { id: 'CA001', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'Introduction au Machine Learning', courseCode: 'CS501', department: 'Intelligence Artificielle (IA)', level: 'Master 1', semester: 'Semestre 1', hourlyVolume: 60 },
    { id: 'CA002', teacherId: 'F002', teacherName: 'Dr. Ellie Sattler', courseName: 'Conception de Systèmes Embarqués', courseCode: 'EE402', department: 'Électronique', level: 'Licence 3', semester: 'Semestre 2', hourlyVolume: 50 },
    { id: 'CA003', teacherId: 'F003', teacherName: 'Dr. Ian Malcolm', courseName: 'Big Data Analytics', courseCode: 'BD601', department: 'Big Data', level: 'Master 2', semester: 'Semestre 1', hourlyVolume: 70 },
    { id: 'CA004', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'Traitement du Langage Naturel', courseCode: 'CS505', department: 'Intelligence Artificielle (IA)', level: 'Master 2', semester: 'Semestre 2', hourlyVolume: 60 },
    { id: 'CA005', teacherId: 'F004', teacherName: 'Dr. Sarah Harding', courseName: 'Design Urbain Durable', courseCode: 'AU201', department: 'Architecture et Urbanisme', level: 'Licence 2', semester: 'Semestre 1', hourlyVolume: 45 },
];

export const scheduleData: ScheduleEntry[] = [
    { id: 'SCH001', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'Intro au ML', courseCode: 'CS501', dayOfWeek: 'Lundi', startTime: '08:00', endTime: '10:00', location: 'Amphi A', level: 'Master 1', semester: 'S1' },
    { id: 'SCH002', teacherId: 'F002', teacherName: 'Dr. Ellie Sattler', courseName: 'Systèmes Embarqués', courseCode: 'EE402', dayOfWeek: 'Lundi', startTime: '10:00', endTime: '12:00', location: 'Salle B101', level: 'Licence 3', semester: 'S1' },
    { id: 'SCH003', teacherId: 'F003', teacherName: 'Dr. Ian Malcolm', courseName: 'Big Data Analytics', courseCode: 'BD601', dayOfWeek: 'Mardi', startTime: '09:00', endTime: '12:00', location: 'Labo C', level: 'Master 2', semester: 'S2' },
    { id: 'SCH004', teacherId: 'F004', teacherName: 'Dr. Sarah Harding', courseName: 'Design Urbain', courseCode: 'AU201', dayOfWeek: 'Mercredi', startTime: '14:00', endTime: '16:00', location: 'Atelier D', level: 'Licence 2', semester: 'S1' },
    { id: 'SCH005', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'NLP', courseCode: 'CS505', dayOfWeek: 'Jeudi', startTime: '10:00', endTime: '12:00', location: 'Amphi A', level: 'Master 2', semester: 'S2' },
    { id: 'SCH006', teacherId: 'F002', teacherName: 'Dr. Ellie Sattler', courseName: 'Systèmes Embarqués (TP)', courseCode: 'EE402', dayOfWeek: 'Vendredi', startTime: '08:00', endTime: '10:00', location: 'Salle B102', level: 'Licence 3', semester: 'S2' },
];

export const examGrades: ExamGrade[] = [
    { id: 'G001', studentId: 'S001', studentName: 'Alice Johnson', courseName: 'Introduction au Machine Learning', courseCode: 'CS501', teacherName: 'Dr. Alan Grant', department: 'Intelligence Artificielle (IA)', examType: 'Partiel', grade: 16, coefficient: 2, date: '2024-10-15' },
    { id: 'G002', studentId: 'S002', studentName: 'Bob Smith', courseName: 'Conception de Systèmes Embarqués', courseCode: 'EE402', teacherName: 'Dr. Ellie Sattler', department: 'Électronique', examType: 'Final', grade: 14, coefficient: 3, date: '2024-12-10' },
    { id: 'G003', studentId: 'S001', studentName: 'Alice Johnson', courseName: 'Introduction au Machine Learning', courseCode: 'CS501', teacherName: 'Dr. Alan Grant', department: 'Intelligence Artificielle (IA)', examType: 'Final', grade: 17, coefficient: 3, date: '2024-12-12' },
    { id: 'G004', studentId: 'S003', studentName: 'Charlie Brown', courseName: 'Big Data Analytics', courseCode: 'BD601', teacherName: 'Dr. Ian Malcolm', department: 'Big Data', examType: 'Partiel', grade: 18, coefficient: 2, date: '2024-10-20' },
];

export const examSchedule: ExamSchedule[] = [
    { id: 'ES001', date: '2025-08-15', time: '08:00-10:00', courseName: 'Mathématiques', supervisor: 'J. Mbemba', room: 'A1', level: 'L1', examType: 'Final' },
    { id: 'ES002', date: '2025-08-16', time: '10:00-12:00', courseName: 'Réseaux', supervisor: 'A. Bissila', room: 'B2', level: 'L2', examType: 'Partiel' },
    { id: 'ES003', date: '2025-08-17', time: '14:00-16:00', courseName: 'Bases de données', supervisor: 'P. Ngoma', room: 'A3', level: 'L3', examType: 'Rattrapage' },
];

export let teacherWorkload: TeacherWorkload[] = [
    { id: 'TW001', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'Introduction au Machine Learning', level: 'Master 1', semester: 'S1', plannedHours: 60, completedHours: 45 },
    { id: 'TW002', teacherId: 'F002', teacherName: 'Dr. Ellie Sattler', courseName: 'Conception de Systèmes Embarqués', level: 'Licence 3', semester: 'S1', plannedHours: 50, completedHours: 50 },
    { id: 'TW003', teacherId: 'F003', teacherName: 'Dr. Ian Malcolm', courseName: 'Big Data Analytics', level: 'Master 2', semester: 'S2', plannedHours: 70, completedHours: 35 },
];

export const teacherAttendance: TeacherAttendance[] = [
    { id: 'ATT001', teacherId: 'F001', teacherName: 'Dr. Alan Grant', courseName: 'Intro au ML', courseCode: 'CS501', date: '2024-09-09', status: 'Présent' },
    { id: 'ATT002', teacherId: 'F002', teacherName: 'Dr. Ellie Sattler', courseName: 'Systèmes Embarqués', courseCode: 'EE402', date: '2024-09-09', status: 'Présent' },
    { id: 'ATT003', teacherId: 'F003', teacherName: 'Dr. Ian Malcolm', courseName: 'Big Data Analytics', courseCode: 'BD601', date: '2024-09-10', status: 'Absent', remarks: 'Maladie' },
    { id: 'ATT004', teacherId: 'F004', teacherName: 'Dr. Sarah Harding', courseName: 'Design Urbain', courseCode: 'AU201', date: '2024-09-11', status: 'Présent' },
];

export const messages: Message[] = [
  {
    id: 'MSG001',
    sender: { name: 'Administration', role: 'Admin' },
    recipients: [{ name: 'Tous les enseignants', role: 'Enseignant' }],
    subject: 'Réunion pédagogique importante',
    body: 'Bonjour à tous, une réunion pédagogique aura lieu ce vendredi à 10h dans la salle du conseil. Votre présence est requise. Cordialement, L\'administration.',
    sentAt: '2024-09-10T09:00:00Z',
    status: 'Lu',
  },
  {
    id: 'MSG002',
    sender: { name: 'Dr. Alan Grant', role: 'Enseignant' },
    recipients: [{ name: 'Étudiants M1 IA', role: 'Étudiant' }],
    subject: 'Rappel : Projet de Machine Learning',
    body: 'N\'oubliez pas que la date limite pour le rendu du projet de ML est le 25 octobre. Aucun retard ne sera accepté.',
    attachment: { name: 'consignes_projet.pdf', url: '#' },
    sentAt: '2024-09-12T14:30:00Z',
    status: 'Envoyé',
  },
   {
    id: 'MSG003',
    sender: { name: 'Alice Johnson', role: 'Étudiant' },
    recipients: [{ name: 'Dr. Alan Grant', role: 'Enseignant' }],
    subject: 'Question concernant le projet',
    body: 'Bonjour Docteur, j\'aurais une question concernant le choix du dataset pour le projet. Serait-il possible d\'en discuter ? Merci.',
    sentAt: '2024-09-13T11:00:00Z',
    status: 'Non lu',
  },
  {
    id: 'MSG004',
    sender: { name: 'Administration', role: 'Admin' },
    recipients: [{ name: 'Tous les étudiants', role: 'Étudiant' }],
    subject: 'Annonce : Fermeture exceptionnelle',
    body: 'L\'université sera fermée le lundi 20 octobre pour maintenance. Les cours reprendront normalement le mardi 21.',
    sentAt: '2024-09-15T16:00:00Z',
    status: 'Envoyé',
  },
];

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

const studentFinancesData: Omit<StudentFinance, 'scolariteCalculee' | 'totalAPayer' | 'reste' | 'statut'>[] = [
    { matricule: '2023-001', fullName: 'Alain Nkouka', level: 'Licence 1', option: 'Informatique', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 5000, avance: 300000 },
    { matricule: '2023-002', fullName: 'Sarah Koumba', level: 'Licence 2', option: 'Gestion', inscription: 50000, semester: 'Pair', fournitures: 20000, support: 10000, bourseType: 'Boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 98000 }, // Avance adjusted to match finalisé status
    { matricule: '2023-003', fullName: 'Paul Ngoma', level: 'Licence 3', option: 'Réseaux', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 10000, avance: 350000 },
    { matricule: '2023-004', fullName: 'Marie Iloki', level: 'Licence 1', option: 'Informatique', inscription: 50000, semester: 'Pair', fournitures: 20000, support: 10000, bourseType: 'Partiellement boursier', reduction: 30, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 0, avance: 150000 },
    { matricule: '2023-005', fullName: 'Kevin Elenga', level: 'Licence 2', option: 'Big Data', inscription: 50000, semester: 'Impair', fournitures: 20000, support: 10000, bourseType: 'Non boursier', reduction: 0, scolariteBase: 400000, latrine: 3000, session: 15000, rattrapage: 5000, avance: 250000 },
];

export const studentFinances: StudentFinance[] = studentFinancesData.map(data => {
    const calculated = calculerFinance(
        data.inscription, data.fournitures, data.support, data.bourseType,
        data.reduction, data.scolariteBase, data.latrine, data.session,
        data.rattrapage, data.avance
    );
    return { ...data, ...calculated };
});

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

const facultyFinancesData: Omit<FacultyFinance, 'totalAPayer' | 'reste' | 'statut' | 'heuresL1' | 'heuresL2' | 'heuresL3' | 'heuresMaster'>[] = [
  { teacherId: 'F001', fullName: 'Dr. Alan Grant', departement: 'Intelligence Artificielle (IA)', tauxL1: 8000, tauxL2: 9000, tauxL3: 10000, tauxMaster: 12000, montantPaye: 400000 },
  { teacherId: 'F002', fullName: 'Dr. Ellie Sattler', departement: 'Électronique', tauxL1: 7000, tauxL2: 8000, tauxL3: 9500, tauxMaster: 11000, montantPaye: 370000 },
  { teacherId: 'F003', fullName: 'Dr. Ian Malcolm', departement: 'Big Data', tauxL1: 8000, tauxL2: 9000, tauxL3: 10000, tauxMaster: 13000, montantPaye: 500000 },
];

export const facultyFinances: FacultyFinance[] = facultyFinancesData.map(data => {
    const calculated = calculerSalaireComplet(
        data.teacherId,
        data.montantPaye,
        data.tauxL1,
        data.tauxL2,
        data.tauxL3,
        data.tauxMaster
    );
    return { ...data, ...calculated };
});

export const adminStaff: AdminStaff[] = [
    { id: 'ADM-001', name: 'Jean Mvoula', email: 'jean.m@university.edu', position: 'Secrétaire général', hireDate: '2015-01-20' },
    { id: 'ADM-002', name: 'Clara Bissila', email: 'clara.b@university.edu', position: 'Comptable', hireDate: '2019-07-11' },
    { id: 'ADM-003', name: 'Michel Samba', email: 'michel.s@university.edu', position: 'Responsable académique', hireDate: '2017-08-01' },
];

export function calculerFinanceAdmin(
  salaire: number, transport: number, avantages: number, montantPaye: number
) {
  const totalAPayer = salaire + transport + avantages;
  const reste = totalAPayer - montantPaye;
  const statut: AdminFinance['statut'] = reste <= 0 ? "Finalisé" : "Non finalisé";

  return { totalAPayer, reste, statut };
}

const adminFinancesData: Omit<AdminFinance, 'totalAPayer' | 'reste' | 'statut'>[] = [
    { matricule: 'ADM-001', fullName: 'Jean Mvoula', poste: 'Secrétaire général', salaireMensuel: 500000, indemniteTransport: 20000, autresAvantages: 30000, montantPaye: 550000 },
    { matricule: 'ADM-002', fullName: 'Clara Bissila', poste: 'Comptable', salaireMensuel: 450000, indemniteTransport: 20000, autresAvantages: 20000, montantPaye: 300000 },
    { matricule: 'ADM-003', fullName: 'Michel Samba', poste: 'Responsable académique', salaireMensuel: 600000, indemniteTransport: 20000, autresAvantages: 40000, montantPaye: 600000 },
];

export const adminFinances: AdminFinance[] = adminFinancesData.map(data => {
    const calculated = calculerFinanceAdmin(
        data.salaireMensuel, data.indemniteTransport, data.autresAvantages, data.montantPaye
    );
    return { ...data, ...calculated };
});

export const accountingTransactions: AccountingTransaction[] = [
  { id: 'TRN001', date: '2025-08-05', type: 'Revenu', sourceBeneficiary: 'Étudiants', category: 'Frais scolarité', amount: 5000000, paymentMethod: 'Espèces', description: 'Paiement semestre impair', responsible: 'Caissier 1' },
  { id: 'TRN002', date: '2025-08-05', type: 'Revenu', sourceBeneficiary: 'Subvention État', category: 'Subvention', amount: 2000000, paymentMethod: 'Virement bancaire', description: 'Aide financière', responsible: 'Comptable' },
  { id: 'TRN003', date: '2025-08-06', type: 'Dépense', sourceBeneficiary: 'Enseignants', category: 'Salaires', amount: 3500000, paymentMethod: 'Chèque', description: 'Paiement enseignants', responsible: 'DRH' },
  { id: 'TRN004', date: '2025-08-07', type: 'Dépense', sourceBeneficiary: 'Administrateurs', category: 'Salaires', amount: 1800000, paymentMethod: 'Virement bancaire', description: 'Paiement admin mensuel', responsible: 'Comptable' },
  { id: 'TRN005', date: '2025-08-07', type: 'Dépense', sourceBeneficiary: 'Fournisseurs', category: 'Fournitures', amount: 500000, paymentMethod: 'Espèces', description: 'Achat matériels bureau', responsible: 'Caissier 2' },
  { id: 'TRN006', date: '2025-08-08', type: 'Revenu', sourceBeneficiary: 'Donateur privé', category: 'Don', amount: 1000000, paymentMethod: 'Virement bancaire', description: 'Soutien infrastructures', responsible: 'Directeur' },
];

export function calculerComptabilite(transactions: AccountingTransaction[]) {
  let revenus = 0;
  let depenses = 0;

  transactions.forEach(t => {
    if (t.type === "Revenu") revenus += t.amount;
    else if (t.type === "Dépense") depenses += t.amount;
  });

  return { revenus, depenses, solde: revenus - depenses };
}


export type { Student, Faculty, Department, AcademicRecord, CourseRecord, CourseAssignment, ScheduleEntry, ExamGrade, ExamSchedule, TeacherWorkload, TeacherAttendance, Message, StudentFinance, FacultyFinance, AdminStaff, AdminFinance, AccountingTransaction };
