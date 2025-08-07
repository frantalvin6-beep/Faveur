import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});

// Dummy flow to keep genkit happy when no flows are defined
ai.defineFlow({name: 'dummyFlow'}, async () => {});
