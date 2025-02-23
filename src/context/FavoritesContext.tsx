"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Define Favorites Context Type
interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (mealId: string) => void;
}

// Create Context
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
});

// Provider Component
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user session on load
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
        loadFavorites(data.session.user.id);
      }
    };
    fetchSession();
  }, []);

  // Load favorites from Supabase
  const loadFavorites = async (userId: string) => {
    const { data, error } = await supabase
      .from("favorites")
      .select("meal_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching favorites:", error);
      return;
    }

    setFavorites(data.map((fav) => fav.meal_id));
  };

  // Toggle favorite (Add or Remove from Supabase)
  const toggleFavorite = async (mealId: string) => {
    if (!userId) {
      router.push("/auth/signin"); // Redirect to sign-in if not logged in
      return;
    }

    if (favorites.includes(mealId)) {
      // Remove from Supabase
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: userId, meal_id: mealId });

      if (error) {
        console.error("Error removing favorite:", error);
        return;
      }
      setFavorites((prev) => prev.filter((id) => id !== mealId));
    } else {
      // Add to Supabase
      const { error } = await supabase.from("favorites").insert([
        { user_id: userId, meal_id: mealId },
      ]);

      if (error) {
        console.error("Error adding favorite:", error);
        return;
      }
      setFavorites((prev) => [...prev, mealId]);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook to use Favorites
export function useFavorites() {
  return useContext(FavoritesContext);
}
