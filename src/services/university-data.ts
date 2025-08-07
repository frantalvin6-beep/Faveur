/**
 * @fileOverview Service layer to abstract data access for AI tools.
 * This file provides functions to query the in-memory database.
 * These functions are designed to be used by Genkit tools and only perform read operations.
 */

import { studentFinances } from '@/lib/data';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

/**
 * Finds a student by name and returns their financial status.
 * @param studentName The full name of the student to search for.
 * @returns An object with the status of the student's finances.
 */
export async function getStudentFinanceStatusByName(studentName: string): Promise<{ status: string }> {
  console.log(`Searching for student: ${studentName}`);
  
  const student = studentFinances.find(
    (s) => s.fullName.toLowerCase() === studentName.toLowerCase()
  );

  if (!student) {
    return { status: `L'étudiant nommé "${studentName}" n'a pas été trouvé dans les archives financières.` };
  }

  if (student.statut === 'Finalisé') {
    return { status: `Oui, les frais de scolarité pour ${studentName} sont finalisés. Le solde est de 0.` };
  } else {
    return { status: `Non, les frais pour ${studentName} ne sont pas finalisés. Il reste un montant de ${formatCurrency(student.reste)} à payer.` };
  }
}
