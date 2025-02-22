"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Keep a list (array) of favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Add or remove an item from the favorites array
  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      // If it's already favorited, remove it
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      }
      // Otherwise, add it
      return [...prev, id];
    });
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Use this hook in your components
export function useFavorites() {
  return useContext(FavoritesContext);
}
