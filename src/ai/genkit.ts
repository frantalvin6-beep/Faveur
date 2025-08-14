
import { genkit, Ai } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
    plugins: [
        googleAI(),
    ]
});

    