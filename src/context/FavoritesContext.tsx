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

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
