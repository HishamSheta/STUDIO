'use server';

/**
 * @fileOverview A flow for generating images for recipes.
 *
 * - generateRecipeImage - A function that generates an image for a recipe.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  GenerateRecipeImageInputSchema,
  GenerateRecipeImageOutputSchema,
  type GenerateRecipeImageInput,
  type GenerateRecipeImageOutput,
} from './types';

export async function generateRecipeImage(
  input: GenerateRecipeImageInput
): Promise<GenerateRecipeImageOutput> {
  return generateRecipeImageFlow(input);
}

const generateRecipeImageFlow = ai.defineFlow(
  {
    name: 'generateRecipeImageFlow',
    inputSchema: GenerateRecipeImageInputSchema,
    outputSchema: GenerateRecipeImageOutputSchema,
  },
  async ({ recipeName }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A delicious-looking, professionally photographed image of "${recipeName}", presented on a clean plate, with a blurred, warm kitchen background.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    const imageUrl = media.url;
    if (!imageUrl) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl };
  }
);
