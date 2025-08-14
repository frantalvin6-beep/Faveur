
'use server';

/**
 * @fileOverview An AI flow to generate marketing article drafts.
 * 
 * - generateArticle - A function that handles the article generation process.
 * - ArticleGenerateInput - The input type for the generateArticle function.
 * - ArticleGenerateOutput - The return type for the generateArticle function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const ArticleGenerateInputSchema = z.object({
  topic: z.string().describe('The main topic for the article.'),
});
export type ArticleGenerateInput = z.infer<typeof ArticleGenerateInputSchema>;

const ArticleGenerateOutputSchema = z.object({
  title: z.string().describe('A catchy and professional title for the article.'),
  description: z.string().describe('A compelling and detailed description for the article, around 2-3 sentences.'),
  imageHint: z.string().describe('Two or three keywords for a relevant stock photo (e.g., "students collaborating", "modern campus").'),
});
export type ArticleGenerateOutput = z.infer<typeof ArticleGenerateOutputSchema>;

export async function generateArticle(input: ArticleGenerateInput): Promise<ArticleGenerateOutput> {
  return generateArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticlePrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: { schema: ArticleGenerateInputSchema },
  output: { schema: ArticleGenerateOutputSchema },
  prompt: `Vous êtes un expert en marketing pour une université francophone.
Votre tâche est de générer un brouillon pour un article promotionnel en FRANÇAIS, basé sur un sujet donné.

Le ton doit être professionnel, engageant et inspirant pour de futurs étudiants.

Sujet: {{{topic}}}
`,
});

const generateArticleFlow = ai.defineFlow(
  {
    name: 'generateArticleFlow',
    inputSchema: ArticleGenerateInputSchema,
    outputSchema: ArticleGenerateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
