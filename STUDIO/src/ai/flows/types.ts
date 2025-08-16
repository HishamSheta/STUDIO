/**
 * @fileOverview Types for AI flows. This file does not use 'use server' and can safely export types.
 */
import {z} from 'genkit';

// From ingredient-recipe-generator.ts
export const GenerateRecipesInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients the user has available.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Any dietary restrictions the user has, such as vegetarian, vegan, gluten-free, etc.'),
  preferences: z
    .string()
    .optional()
    .describe('The user’s cuisine preferences, such as Italian, Mexican, etc.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

export const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A list of the ingredients needed.'),
      instructions: z.string().describe('Instructions on how to make the recipe.'),
      imageUrl: z.string().optional().describe('URL of an image for the recipe.'),
    })
  ).describe('An array of recipe suggestions based on the ingredients provided.'),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;


// From smart-ingredient-substitution.ts
export const SuggestIngredientSubstitutionsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  missingIngredients: z
    .array(z.string())
    .describe('A list of ingredients that are missing.'),
  availableIngredients: z
    .array(z.string())
    .describe('A list of ingredients that are currently available.'),
});
export type SuggestIngredientSubstitutionsInput = z.infer<
  typeof SuggestIngredientSubstitutionsInputSchema
>;

export const SuggestIngredientSubstitutionsOutputSchema = z.object({
  substitutions: z.record(z.string()).describe(
    'A map of missing ingredients to a list of possible substitutions. The key is the missing ingredient, and the value is a comma-separated string of possible substitutions.'
  ),
});

export type SuggestIngredientSubstitutionsOutput = z.infer<
  typeof SuggestIngredientSubstitutionsOutputSchema
>;

// From text-to-speech.ts
export const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The audio data as a base64-encoded data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

// From image-generator.ts
export const GenerateRecipeImageInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to generate an image for.'),
});
export type GenerateRecipeImageInput = z.infer<typeof GenerateRecipeImageInputSchema>;

export const GenerateRecipeImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateRecipeImageOutput = z.infer<typeof GenerateRecipeImageOutputSchema>;

// From detect-ingredients-audio.ts
export const DetectIngredientsAudioInputSchema = z.object({
    audioDataUri: z
    .string()
    .describe("An audio recording of a user listing ingredients, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DetectIngredientsAudioInput = z.infer<typeof DetectIngredientsAudioInputSchema>;

export const DetectIngredientsAudioOutputSchema = z.object({
    ingredients: z.string().describe('A comma-separated list of ingredients detected from the audio.'),
});
export type DetectIngredientsAudioOutput = z.infer<typeof DetectIngredientsAudioOutputSchema>;

// From calculate-macros.ts
export const CalculateMacrosInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A comma-separated list of ingredients in the recipe.'),
});
export type CalculateMacrosInput = z.infer<typeof CalculateMacrosInputSchema>;

export const CalculateMacrosOutputSchema = z.object({
  calories: z.number().describe('Estimated total calories for a single serving.'),
  protein: z.number().describe('Estimated total protein in grams for a single serving.'),
  carbs: z.number().describe('Estimated total carbohydrates in grams for a single serving.'),
  fat: z.number().describe('Estimated total fat in grams for a single serving.'),
});
export type CalculateMacrosOutput = z.infer<typeof CalculateMacrosOutputSchema>;
