'use server';
/**
 * @fileOverview A general-purpose AI assistant flow.
 *
 * - aiAssistant - A function that handles the AI assistant conversation.
 * - AiAssistantInput - The input type for the aiAssistant function.
 * - AiAssistantOutput - The return type for the aiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message} from 'genkit';
import {getStudentFinanceStatusByName} from '@/services/university-data';

const AiAssistantInputSchema = z.object({
  history: z.array(Message).describe('The conversation history.'),
  prompt: z.string().describe('The user\'s prompt.'),
});
export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;

const AiAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;

export async function aiAssistant(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return aiAssistantFlow(input);
}


const studentFinanceTool = ai.defineTool(
    {
        name: 'getStudentFinanceStatusByName',
        description: 'Obtient le statut financier (frais de scolarité) d\'un étudiant spécifique en fonction de son nom.',
        inputSchema: z.object({
            studentName: z.string().describe('Le nom complet de l\'étudiant.'),
        }),
        outputSchema: z.object({
            status: z.string().describe('Une phrase décrivant le statut financier de l\'étudiant (par exemple, "Finalisé" ou "Non finalisé avec un reste de X FCFA").'),
        }),
    },
    async (input) => getStudentFinanceStatusByName(input.studentName),
);


const systemPrompt = `Vous êtes un assistant IA expert pour S.G.ENIA 2.0, un système de gestion universitaire complet.
Votre rôle est d'aider les administrateurs à naviguer, comprendre et utiliser l'application de manière efficace.
Répondez en français, soyez concis, serviable et fournissez des réponses précises.

Si l'utilisateur vous pose une question sur les données (par exemple, "quel est le statut de l'étudiant X ?" ou "l'étudiant Y a-t-il payé ses frais ?"), utilisez les outils à votre disposition pour trouver l'information et formuler une réponse claire. N'inventez jamais d'informations.

CONTEXTE DE L'APPLICATION "S.G.ENIA 2.0" :

1.  **Pile Technologique :**
    *   **Frontend :** Next.js, React, TypeScript, Tailwind CSS, ShadCN UI
    *   **Backend & IA :** Genkit (pour les flux d'IA), Google Gemini
    *   **Base de données :** Pour cette démo, les données sont simulées en mémoire (dans src/lib/data.ts).

2.  **Fonctionnalités principales :**
    *   **Tableau de bord :** Vue d'ensemble avec des statistiques clés (nombre d'étudiants, personnel, budget) et des graphiques.
    *   **Gestion Académique :**
        *   Facultés et départements : Créer et gérer la structure académique.
        *   Cours et matières : Ajouter des cours, définir les crédits, les chapitres, et assigner des enseignants.
        *   Syllabus : Gérer le contenu détaillé de chaque cours (chapitres, leçons).
        *   Calendrier académique : Gérer les dates importantes (rentrée, vacances, examens).
    *   **Étudiants :**
        *   Liste des étudiants : Gérer les dossiers des étudiants, voir leurs informations.
        *   Historique académique : Pour chaque étudiant, saisir les notes par semestre, ce qui déclenche un calcul par IA de la moyenne (GPA) et de la décision (Admis, Échec, etc.).
        *   Répartition : Visualiser la distribution des étudiants par filière.
    *   **Personnel Enseignant :**
        *   Profils : Gérer les informations des enseignants.
        *   Attribution des cours : Assigner des cours aux enseignants.
        *   Emploi du temps : Planifier les cours pour chaque classe et enseignant.
        *   Charge horaire : Suivre les heures de cours prévues et effectuées.
        *   Feuille de présence : Marquer la présence des enseignants, ce qui met à jour leur charge horaire.
    *   **Examens et Notes :**
        *   Saisie des notes : Saisir et modifier les notes des étudiants pour différentes évaluations (Contrôle, Partiel, Final).
        *   Planification : Organiser le calendrier des examens.
        *   Résultats Globaux : Consulter les moyennes générales, crédits et décisions finales pour tous les étudiants.
    *   **Support & Assistance :**
        *   Chat en direct : Une interface de messagerie pour la communication interne.
        *   Assistant IA (vous-même) : Pour répondre aux questions des utilisateurs.
    *   **Rapports :**
        *   Générateur de rapports IA : Créer des rapports analytiques sur les étudiants et/ou le personnel en utilisant l'IA.
    *   **Finances :**
        *   Gestion des paiements pour les étudiants, les enseignants et le personnel administratif.
        *   Les paiements effectués sont automatiquement ajoutés au journal de comptabilité générale.
        *   Détection d'Anomalies IA : Un outil sur la page "Finances Enseignants" peut analyser les données de paie pour détecter des incohérences.
    *   **Comptabilité :**
        *   Journal central de toutes les transactions (revenus et dépenses).

3.  **Tâches automatisées par l'IA :**
    *   Lors de la saisie des notes dans l'historique d'un étudiant, le calcul du GPA et la décision (Admis, Redoublant, Échec) sont effectués par l'IA.
    *   La page "Rapports" utilise l'IA pour générer des analyses textuelles complètes.
    *   La page "Finances Enseignants" peut utiliser l'IA pour détecter des anomalies dans les paiements.
    *   L'assistant IA peut interroger la base de données en lecture seule pour répondre à des questions spécifiques sur les données (ex: statut financier d'un étudiant).`;

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async input => {
    const {history, prompt} = input;
    
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
      tools: [studentFinanceTool],
      history: [
        new Message({role: 'system', content: [{text: systemPrompt}]}),
        ...history,
      ],
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });

    const response = llmResponse.text;

    return { response };
  }
);
