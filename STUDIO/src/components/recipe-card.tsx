"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Recipe } from "@/lib/types";
import { Heart, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export function RecipeCard({ recipe, onView, onToggleFavorite, isFavorite }: RecipeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={recipe.imageUrl || `https://placehold.co/600x400.png`}
            alt={recipe.name}
            className="w-full h-full object-cover"
            data-ai-hint="food recipe"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="mb-2 text-lg font-headline">{recipe.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {recipe.ingredients}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(recipe)}
          aria-label="Toggle Favorite"
        >
          <Heart
            className={cn(
              "h-6 w-6 text-muted-foreground transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : ""
            )}
          />
        </Button>
        <Button onClick={() => onView(recipe)} variant="outline">
          عرض الوصفة
          <UtensilsCrossed className="mr-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
