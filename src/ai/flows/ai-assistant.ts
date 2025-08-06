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

const systemPrompt = `Vous êtes un assistant IA pour Campus Central, un système de gestion universitaire.
Votre rôle est d'aider les administrateurs à naviguer, comprendre et utiliser l'application.
Vous devez être concis, serviable et fournir des réponses précises.
N'inventez pas de fonctionnalités. Basez vos réponses sur les fonctionnalités existantes de l'application.
Répondez en français.`;

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async input => {
    const {history, prompt} = input;
    
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
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
