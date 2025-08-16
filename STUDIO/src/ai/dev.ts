import { config } from 'dotenv';
config();

import '@/ai/flows/ingredient-recipe-generator.ts';
import '@/ai/flows/smart-ingredient-substitution.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/types.ts';
import '@/ai/flows/image-generator.ts';
import '@/ai/flows/detect-ingredients-audio.ts';
import '@/ai/flows/calculate-macros.ts';
