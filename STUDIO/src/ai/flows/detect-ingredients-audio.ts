'use server';
/**
 * @fileOverview An AI flow to detect ingredients from an audio input.
 *
 * - detectIngredientsFromAudio - A function that transcribes audio and extracts ingredients.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  DetectIngredientsAudioInputSchema,
  DetectIngredientsAudioOutputSchema,
  type DetectIngredientsAudioInput,
  type DetectIngredientsAudioOutput,
} from './types';

export async function detectIngredientsFromAudio(
  input: DetectIngredientsAudioInput
): Promise<DetectIngredientsAudioOutput> {
  return detectIngredientsAudioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectIngredientsAudioPrompt',
  input: { schema: DetectIngredientsAudioInputSchema },
  output: { schema: DetectIngredientsAudioOutputSchema },
  prompt: `You are a kitchen assistant. The user has provided an audio recording of themselves listing ingredients they have.
Your task is to transcribe the audio and identify the ingredients mentioned.
Return the ingredients as a single, comma-separated string.

Audio input: {{media url=audioDataUri}}`,
});

const detectIngredientsAudioFlow = ai.defineFlow(
  {
    name: 'detectIngredientsAudioFlow',
    inputSchema: DetectIngredientsAudioInputSchema,
    outputSchema: DetectIngredientsAudioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to detect ingredients from audio.');
    }
    return output;
  }
);

    