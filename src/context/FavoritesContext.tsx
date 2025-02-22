"use client";

import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext<any>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<any[]>([]);

  const addFavorite = (meal: any) => {
    setFavorites((prev) => [...prev, meal]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((meal) => meal.id !== id));
  };

  const toggleFavorite = (meal: any) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === meal.id)
        ? prev.filter((fav) => fav.id !== meal.id)
        : [...prev, meal]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
