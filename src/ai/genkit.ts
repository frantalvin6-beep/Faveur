import {genkit} from 'genkit';

export const ai = genkit({
  plugins: [],
});

// Dummy flow to keep genkit happy when no flows are defined
ai.defineFlow({name: 'dummyFlow'}, async () => {});
