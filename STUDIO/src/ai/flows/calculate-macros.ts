'use server';

/**
 * @fileOverview An AI flow to calculate estimated calories and macros for a recipe.
 *
 * - calculateMacros - A function that estimates nutritional information.
 */

import { ai } from '@/ai/genkit';
import {
  CalculateMacrosInputSchema,
  CalculateMacrosOutputSchema,
  type CalculateMacrosInput,
  type CalculateMacrosOutput,
} from './types';

export async function calculateMacros(
  input: CalculateMacrosInput
): Promise<CalculateMacrosOutput> {
  return calculateMacrosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateMacrosPrompt',
  input: { schema: CalculateMacrosInputSchema },
  output: { schema: CalculateMacrosOutputSchema },
  prompt: `You are a nutrition expert. Given a recipe name and its ingredients, estimate the total calories, protein, carbohydrates, and fats for a single serving of the recipe.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}

Provide your answer in the format defined by the output schema. The values should be numbers.`,
});

const calculateMacrosFlow = ai.defineFlow(
  {
    name: 'calculateMacrosFlow',
    inputSchema: CalculateMacrosInputSchema,
    outputSchema: CalculateMacrosOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to calculate macros.');
    }
    return output;
  }
);
