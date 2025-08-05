'use server';
/**
 * @fileOverview Generates AI-powered reports on student and faculty data.
 *
 * - generateReport - A function that generates the report.
 * - GenerateReportInput - The input type for the generateReport function.
 * - GenerateReportOutput - The return type for the generateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportInputSchema = z.object({
  studentData: z.string().describe('Student data in JSON format.'),
  facultyData: z.string().describe('Faculty data in JSON format.'),
  reportType: z
    .enum(['Student', 'Faculty', 'Both'])
    .describe('The type of report to generate.'),
  includeGraphs: z.boolean().optional().describe('Whether to include graphs in the report.'),
  includeMetrics: z.boolean().optional().describe('Whether to include metrics in the report.'),
  includeEvaluation: z.boolean().optional().describe('Whether to include an overall evaluation in the report.'),
});
export type GenerateReportInput = z.infer<typeof GenerateReportInputSchema>;

const GenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated AI-powered report.'),
});
export type GenerateReportOutput = z.infer<typeof GenerateReportOutputSchema>;

export async function generateReport(input: GenerateReportInput): Promise<GenerateReportOutput> {
  return generateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportPrompt',
  input: {schema: GenerateReportInputSchema},
  output: {schema: GenerateReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating reports for university administrators.

You will receive student and faculty data, and your task is to generate a comprehensive report based on the data and the requested report type.

Student Data: {{{studentData}}}
Faculty Data: {{{facultyData}}}
Report Type: {{{reportType}}}

Instructions:
- If includeGraphs is true, include relevant graphs in the report.{{{includeGraphs}}}
- If includeMetrics is true, include key metrics and statistics.{{{includeMetrics}}}
- If includeEvaluation is true, provide an overall evaluation and insights.{{{includeEvaluation}}}

Make sure the report is well-structured, easy to understand, and provides actionable insights for the administrators.
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
