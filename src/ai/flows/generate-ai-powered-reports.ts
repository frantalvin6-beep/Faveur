'use server';
/**
 * @fileOverview Génère des rapports basés sur l'IA sur les données des étudiants et du personnel.
 *
 * - generateReport - Une fonction qui génère le rapport.
 * - GenerateReportInput - Le type d'entrée pour la fonction generateReport.
 * - GenerateReportOutput - Le type de retour pour la fonction generateReport.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  studentData: z.string().describe('Données des étudiants au format JSON.'),
  facultyData: z.string().describe('Données du personnel au format JSON.'),
  reportType: z
    .enum(['Student', 'Faculty', 'Both'])
    .describe('Le type de rapport à générer.'),
  includeGraphs: z.boolean().optional().describe('Indique si des graphiques doivent être inclus dans le rapport.'),
  includeMetrics: z.boolean().optional().describe('Indique si des métriques doivent être incluses dans le rapport.'),
  includeEvaluation: z.boolean().optional().describe('Indique si une évaluation globale doit être incluse dans le rapport.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('Le rapport généré par l\'IA.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `Vous êtes un assistant IA spécialisé dans la génération de rapports pour les administrateurs d'université.

Vous recevrez des données sur les étudiants et le personnel, et votre tâche est de générer un rapport complet basé sur ces données et le type de rapport demandé.

Données des étudiants: {{{studentData}}}
Données du personnel: {{{facultyData}}}
Type de rapport: {{{reportType}}}

Instructions:
- Si includeGraphs est vrai, incluez des graphiques pertinents dans le rapport.{{{includeGraphs}}}
- Si includeMetrics est vrai, incluez des métriques et des statistiques clés.{{{includeMetrics}}}
- Si includeEvaluation est vrai, fournissez une évaluation globale et des aperçus.{{{includeEvaluation}}}

Assurez-vous que le rapport est bien structuré, facile à comprendre et qu'il fournit des informations exploitables pour les administrateurs.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateReportFlow = ai.defineFlow(
  {
    name: 'generateReportFlow',
    inputSchema: GenerateReportInputSchema,
    outputSchema: GenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
