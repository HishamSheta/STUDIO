'use server';

/**
 * @fileOverview An AI agent that suggests recipes based on a list of ingredients.
 *
 * - generateRecipes - A function that generates recipe suggestions based on ingredients.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateRecipesInput, GenerateRecipesOutput } from '@/ai/flows/types';
import { GenerateRecipesInputSchema, GenerateRecipesOutputSchema } from '@/ai/flows/types';
import { generateRecipeImage } from '@/ai/flows/image-generator';

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {schema: GenerateRecipesInputSchema},
  output: {schema: GenerateRecipesOutputSchema},
  prompt: `You are a recipe suggestion bot. Given a list of ingredients, you will
suggest recipes that the user can make.

Ingredients: {{{ingredients}}}

{{#if dietaryRestrictions}}
Dietary Restrictions: {{{dietaryRestrictions}}}
{{/if}}

{{#if preferences}}
Cuisine Preferences: {{{preferences}}}
{{/if}}

Suggest 3 different recipes.

Each recipe should have a name, a list of ingredients, and instructions on how to make it.

Format the recipes in JSON format.
`,
});

const generateRecipesFlow = ai.defineFlow(
  {
    name: 'generateRecipesFlow',
    inputSchema: GenerateRecipesInputSchema,
    outputSchema: GenerateRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Unable to generate recipes.");
    }

    // Generate images for each recipe in parallel
    const imagePromises = output.recipes.map(recipe => 
      generateRecipeImage({ recipeName: recipe.name })
    );
    const imageResults = await Promise.all(imagePromises);

    // Add imageUrl to each recipe
    const recipesWithImages = output.recipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: imageResults[index].imageUrl,
    }));
    
    return { recipes: recipesWithImages };
  }
);
