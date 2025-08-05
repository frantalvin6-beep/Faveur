import type { Student, Faculty } from './types';

export const students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', email: 'alice.j@university.edu', department: 'Informatique', year: 3, gpa: 3.8, enrollmentDate: '2021-09-01' },
  { id: 'S002', name: 'Bob Smith', email: 'bob.s@university.edu', department: 'Physique', year: 2, gpa: 3.5, enrollmentDate: '2022-09-01' },
  { id: 'S003', name: 'Charlie Brown', email: 'charlie.b@university.edu', department: 'Mathématiques', year: 4, gpa: 3.9, enrollmentDate: '2020-09-01' },
  { id: 'S004', name: 'Diana Prince', email: 'diana.p@university.edu', department: 'Histoire', year: 3, gpa: 3.6, enrollmentDate: '2021-09-01' },
  { id: 'S005', name: 'Ethan Hunt', email: 'ethan.h@university.edu', department: 'Informatique', year: 1, gpa: 3.2, enrollmentDate: '2023-09-01' },
  { id: 'S006', name: 'Fiona Glenanne', email: 'fiona.g@university.edu', department: 'Chimie', year: 2, gpa: 3.7, enrollmentDate: '2022-09-01' },
  { id: 'S007', name: 'George Costanza', email: 'george.c@university.edu', department: 'Commerce', year: 4, gpa: 3.1, enrollmentDate: '2020-09-01' },
];

export const faculty: Faculty[] = [
  { id: 'F001', name: 'Dr. Alan Grant', email: 'alan.g@university.edu', department: 'Informatique', position: 'Professeur', specialization: 'Intelligence Artificielle', hireDate: '2010-08-15' },
  { id: 'F002', name: 'Dr. Ellie Sattler', email: 'ellie.s@university.edu', department: 'Physique', position: 'Professeur agrégé', specialization: 'Mécanique quantique', hireDate: '2015-07-20' },
  { id: 'F003', name: 'Dr. Ian Malcolm', email: 'ian.m@university.edu', department: 'Mathématiques', position: 'Professeur', specialization: 'Théorie du chaos', hireDate: '2012-01-10' },
  { id: 'F004', name: 'Dr. Sarah Harding', email: 'sarah.h@university.edu', department: 'Histoire', position: 'Professeur assistant', specialization: 'Civilisations anciennes', hireDate: '2018-09-01' },
  { id: 'F005', name: 'Dr. John Hammond', email: 'john.h@university.edu', department: 'Commerce', position: 'Chargé de cours', specialization: 'Entrepreneuriat', hireDate: '2020-02-25' },
];
