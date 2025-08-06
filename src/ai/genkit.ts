'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineFlow} from 'genkit';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// Dummy flow to keep genkit happy when no flows are defined
defineFlow({name: 'dummyFlow'}, async () => {});
