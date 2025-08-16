'use server';

/**
 * @fileOverview AI agent that suggests ingredient substitutions for a recipe.
 *
 * - suggestIngredientSubstitutions - A function that handles the ingredient substitution process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SuggestIngredientSubstitutionsInput, SuggestIngredientSubstitutionsOutput } from '@/ai/flows/types';
import { SuggestIngredientSubstitutionsInputSchema, SuggestIngredientSubstitutionsOutputSchema } from '@/ai/flows/types';


export async function suggestIngredientSubstitutions(
  input: SuggestIngredientSubstitutionsInput
): Promise<SuggestIngredientSubstitutionsOutput> {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {schema: SuggestIngredientSubstitutionsInputSchema},
  output: {schema: SuggestIngredientSubstitutionsOutputSchema},
  prompt: `You are a helpful cooking assistant. Given a recipe name, a list of missing ingredients, and a list of available ingredients, you will suggest ingredient substitutions for the missing ingredients.

Recipe Name: {{{recipeName}}}
Missing Ingredients: {{#each missingIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Available Ingredients: {{#each availableIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest substitutions for the missing ingredients using the available ingredients. The substitutions should make sense in the context of the recipe.

Format your response as a JSON object where the key is the missing ingredient and the value is a comma-separated string of possible substitutions. For example, if the missing ingredient is "eggs" and the available ingredients are "applesauce" and "mashed banana", the response should be:

{
  "eggs": "applesauce, mashed banana"
}

If there are no good substitutions, return an empty string for that ingredient.
`,
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
