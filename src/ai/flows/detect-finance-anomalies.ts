'use server';
/**
 * @fileOverview Détecte les anomalies dans les données financières.
 *
 * - detectAnomalies - Fonction qui analyse les données pour trouver des incohérences.
 * - DetectAnomaliesInput - Type d'entrée pour la fonction.
 * - DetectAnomaliesOutput - Type de retour pour la fonction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomaliesInputSchema = z.object({
  financeData: z.string().describe("Données financières (ex: fiches de paie) au format JSON."),
  personnelData: z.string().describe("Liste du personnel (ex: enseignants) au format JSON pour vérification croisée."),
});
export type DetectAnomaliesInput = z.infer<typeof DetectAnomaliesInputSchema>;

const AnomalySchema = z.object({
    severity: z.enum(['Haute', 'Moyenne', 'Basse']).describe("La sévérité de l'anomalie détectée."),
    description: z.string().describe("Description claire et concise de l'anomalie."),
    recommendation: z.string().describe("Action recommandée pour vérifier ou corriger l'anomalie."),
});

const DetectAnomaliesOutputSchema = z.object({
  anomalies: z.array(AnomalySchema).describe("Une liste des anomalies financières détectées."),
});
export type DetectAnomaliesOutput = z.infer<typeof DetectAnomaliesOutputSchema>;

export async function detectAnomalies(input: DetectAnomaliesInput): Promise<DetectAnomaliesOutput> {
  return detectAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomaliesPrompt',
  input: {schema: DetectAnomaliesInputSchema},
  output: {schema: DetectAnomaliesOutputSchema},
  prompt: `Vous êtes un auditeur financier expert spécialisé dans la détection de fraudes et d'anomalies dans les systèmes de paie universitaires.

Votre tâche est d'analyser les données financières fournies et de les comparer avec la liste du personnel pour identifier toute incohérence, erreur ou activité suspecte.

Données Financières (Fiches de paie):
{{{financeData}}}

Liste du Personnel:
{{{personnelData}}}

Exemples d'anomalies à rechercher :
- Paiements effectués à des personnes qui ne figurent pas sur la liste du personnel (enseignants fantômes).
- Salaires ou taux horaires excessivement élevés par rapport à la norme.
- Duplications de paiements.
- Incohérences entre les heures travaillées enregistrées et le salaire versé.

Pour chaque anomalie trouvée, fournissez une description claire, évaluez sa sévérité et proposez une recommandation pour investigation. Si aucune anomalie n'est trouvée, retournez une liste vide.
`,
});

const detectAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectAnomaliesFlow',
    inputSchema: DetectAnomaliesInputSchema,
    outputSchema: DetectAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
