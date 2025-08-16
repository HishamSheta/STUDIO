"use client";

import type { Recipe } from "@/lib/types";
import { ChefHat } from "lucide-react";

interface ShareableRecipeImageProps {
  recipe: Recipe;
}

export function ShareableRecipeImage({ recipe }: ShareableRecipeImageProps) {
  const ingredientsList = recipe.ingredients.split(',').map(item => item.trim()).filter(Boolean);

  return (
    <div 
        className="w-[600px] h-[800px] bg-background p-8 flex flex-col font-body border-4 border-primary shadow-2xl" 
        style={{ direction: 'rtl' }}
    >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-primary/50 pb-4">
            <div className="flex items-center gap-3">
                <ChefHat className="h-12 w-12 text-primary" />
                <div className="flex flex-col">
                    <span className="text-3xl font-bold font-headline text-primary">
                        طباخ AI
                    </span>
                    <span className="text-sm text-muted-foreground">
                        من الموجود، نعمل الموعود
                    </span>
                </div>
            </div>
            {recipe.imageUrl && (
                 <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-primary/50">
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                    />
                 </div>
            )}
        </div>
      
        {/* Recipe Name */}
        <div className="py-6 text-center bg-primary/10 my-6 rounded-lg">
            <h1 className="text-4xl font-headline font-bold text-primary leading-tight px-4">{recipe.name}</h1>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-card p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-headline font-semibold text-foreground mb-4 border-b-2 border-border pb-2">المكونات:</h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg text-card-foreground">
                {ingredientsList.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="text-primary pt-2">●</span>
                        <span>{ingredient}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 text-sm text-muted-foreground">
            <p>wasef.app :أنشئت وصفتك باستخدام</p>
        </div>
    </div>
  );
}
