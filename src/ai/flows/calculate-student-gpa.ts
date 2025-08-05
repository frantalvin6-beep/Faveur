'use server';
/**
 * @fileOverview Calcule la moyenne pondérée (GPA) d'un étudiant et la décision académique associée en utilisant l'IA.
 *
 * - calculateGpa - Une fonction qui gère le calcul du GPA et de la décision.
 * - CalculateGpaInput - Le type d'entrée pour la fonction calculateGpa.
 * - CalculateGpaOutput - Le type de retour pour la fonction calculateGpa.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseRecordSchema = z.object({
  name: z.string().describe("Le nom de la matière."),
  grade: z.number().describe("La note obtenue dans la matière."),
  coefficient: z.number().describe("Le coefficient de la matière."),
});

const CalculateGpaInputSchema = z.object({
  courses: z.array(CourseRecordSchema).describe("La liste des matières avec leurs notes et coefficients."),
});
export type CalculateGpaInput = z.infer<typeof CalculateGpaInputSchema>;

const CalculateGpaOutputSchema = z.object({
  gpa: z.number().describe("La moyenne générale pondérée calculée (GPA)."),
  decision: z.enum(['Admis', 'Échec', 'Redoublant']).describe("La décision académique basée sur le GPA."),
});
export type CalculateGpaOutput = z.infer<typeof CalculateGpaOutputSchema>;

export async function calculateGpa(input: CalculateGpaInput): Promise<CalculateGpaOutput> {
  return calculateGpaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateGpaPrompt',
  input: {schema: CalculateGpaInputSchema},
  output: {schema: CalculateGpaOutputSchema},
  prompt: `Vous êtes une IA registraire académique. Votre tâche est de calculer la moyenne générale pondérée (GPA) et de déterminer la décision académique pour un étudiant en fonction de ses notes et des coefficients associés.

Règles de calcul de la GPA :
- La GPA est la somme des (note * coefficient) divisée par la somme des coefficients.
- Arrondir la GPA à deux décimales.

Règles de décision :
- GPA >= 10 : Admis
- 7 <= GPA < 10 : Redoublant
- GPA < 7 : Échec

Notes et coefficients de l'étudiant :
{{#each courses}}
- {{name}}: Note = {{grade}}, Coeff = {{coefficient}}
{{/each}}
`,
});

const calculateGpaFlow = ai.defineFlow(
  {
    name: 'calculateGpaFlow',
    inputSchema: CalculateGpaInputSchema,
    outputSchema: CalculateGpaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
