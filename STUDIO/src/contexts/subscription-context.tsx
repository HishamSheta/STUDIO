"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useEffect, useCallback } from "react";
import type { Recipe } from "@/lib/types";

export type Plan = "Free" | "Premium";

interface SubscriptionContextType {
  plan: Plan;
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipe: Recipe) => void;
  isFavorite: (recipe: Recipe) => boolean;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);


export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // All features are now free, so the plan is always effectively "Premium".
  const [plan] = useState<Plan>("Premium");
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavorites = localStorage.getItem("cookai_favorites");
      if(storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
  }, []);

  const addFavorite = useCallback((recipe: Recipe) => {
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    try {
       localStorage.setItem('cookai_favorites', JSON.stringify(newFavorites));
    } catch (error) {
       console.error("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);
  
  const removeFavorite = useCallback((recipe: Recipe) => {
     const newFavorites = favorites.filter(fav => fav.name !== recipe.name);
     setFavorites(newFavorites);
     try {
       localStorage.setItem('cookai_favorites', JSON.stringify(newFavorites));
     } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
     }
  }, [favorites]);
  
  const isFavorite = useCallback((recipe: Recipe) => {
    return favorites.some(fav => fav.name === recipe.name);
  }, [favorites]);


  const value: SubscriptionContextType = {
    plan,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
