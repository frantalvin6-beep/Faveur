import type { Student, Faculty, Department, AcademicRecord, CourseRecord } from './types';

export const students: Student[] = [
  { 
    id: 'S001', 
    name: 'Alice Johnson', 
    email: 'alice.j@university.edu', 
    department: 'Intelligence Artificielle (IA)', 
    year: 3, 
    gpa: 3.8, 
    enrollmentDate: '2021-09-01',
    academicHistory: [
      { semester: 'Semestre 1', year: 2021, courses: [{name: 'Algo 1', grade: 18}, {name: 'Maths 1', grade: 17}], gpa: 17.5, decision: 'Admis' },
      { semester: 'Semestre 2', year: 2022, courses: [{name: 'Algo 2', grade: 16}, {name: 'Web 1', grade: 18}], gpa: 17, decision: 'Admis' },
    ]
  },
  { 
    id: 'S002', 
    name: 'Bob Smith', 
    email: 'bob.s@university.edu', 
    department: 'Génie Électrique et Informatique Industrielle', 
    year: 2, 
    gpa: 3.5, 
    enrollmentDate: '2022-09-01',
    academicHistory: [
        { semester: 'Semestre 1', year: 2022, courses: [{name: 'Electronique 1', grade: 15}, {name: 'Automatique', grade: 14}], gpa: 14.5, decision: 'Admis' },
    ]
  },
  { 
    id: 'S003', 
    name: 'Charlie Brown', 
    email: 'charlie.b@university.edu', 
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
    department: 'Mécatronique', 
    year: 4, 
    gpa: 3.1, 
    enrollmentDate: '2020-09-01',
    academicHistory: []
  },
];

export const faculty: Faculty[] = [
  { id: 'F001', name: 'Dr. Alan Grant', email: 'alan.g@university.edu', department: 'Intelligence Artificielle', position: 'Professeur', specialization: 'Machine Learning', hireDate: '2010-08-15' },
  { id: 'F002', name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', department: 'Génie Électrique et Informatique Industrielle', position: 'Professeur agrégé', specialization: 'Systèmes embarqués', hireDate: '2015-07-20' },
  { id: 'F003', name: 'Dr. Ian Malcolm', email: 'ian.m@university.edu', department: 'Big Data', position: 'Professeur', specialization: 'Analyse de données', hireDate: '2012-01-10' },
  { id: 'F004', name: 'Dr. Sarah Harding', email: 'sarah.h@university.edu', department: 'Architecture et Urbanisme', position: 'Professeur assistant', specialization: 'Urbanisme durable', hireDate: '2018-09-01' },
  { id: 'F005', name: 'Dr. John Hammond', email: 'john.h@university.edu', department: 'Ressources Humaines axées Digital', position: 'Chargé de cours', specialization: 'Management digital', hireDate: '2020-02-25' },
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

export type { Student, Faculty, Department, AcademicRecord, CourseRecord };
