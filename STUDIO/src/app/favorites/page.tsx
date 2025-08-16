"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { Heart } from "lucide-react";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeView } from "@/components/recipe-view";
import type { Recipe } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function FavoritesPage() {
  const { favorites, removeFavorite, isFavorite } = useSubscription();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeViewOpen, setIsRecipeViewOpen] = useState(false);
  const { toast } = useToast();

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeViewOpen(true);
  };
  
  const handleToggleFavorite = (recipe: Recipe) => {
    removeFavorite(recipe);
    toast({ title: "تمت الإزالة من المفضلة!" });
  };


  return (
    <>
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-primary" />
            وصفاتك المفضلة
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            كل جواهرك الطهوية المحفوظة في مكان واحد.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.name}
                recipe={recipe}
                onView={handleViewRecipe}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>لا توجد مفضلات بعد!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">لم تقم بحفظ أي وصفات. ابدأ في الاستكشاف واحفظ مفضلاتك!</p>
                    <Button asChild>
                        <Link href="/">البحث عن وصفات</Link>
                    </Button>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
       <RecipeView 
        recipe={selectedRecipe}
        isOpen={isRecipeViewOpen}
        onClose={() => setIsRecipeViewOpen(false)}
        availableIngredients={""} // Not needed here as substitutions are from the home page context
      />
    </>
  );
}
