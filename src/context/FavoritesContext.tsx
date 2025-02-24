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

  // Fetch user session on load & listen for changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
        loadFavorites(data.session.user.id);
      } else {
        setUserId(null);
        setFavorites([]);
      }
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadFavorites(session.user.id);
      } else {
        setUserId(null);
        setFavorites([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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
    
    setFavorites(data.map((item) => item.meal_id));
  };

  // Toggle Favorite Function
  const toggleFavorite = async (mealId: string) => {
    if (!userId) {
      router.push("/login"); // Redirect if not signed in
      return;
    }

    const isFavorited = favorites.includes(mealId);
    if (isFavorited) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: userId, meal_id: mealId });

      if (!error) {
        setFavorites(favorites.filter((id) => id !== mealId));
      } else {
        console.error("Error removing favorite:", error);
      }
    } else {
      // Check if already exists to prevent duplicates
      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select("meal_id")
        .eq("user_id", userId)
        .eq("meal_id", mealId);

      if (fetchError) {
        console.error("Error checking favorite status:", fetchError);
        return;
      }

      if (data.length === 0) {
        // Add to favorites if not already there
        const { error } = await supabase
          .from("favorites")
          .insert([{ user_id: userId, meal_id: mealId }]);

        if (!error) {
          setFavorites([...favorites, mealId]);
        } else {
          console.error("Error adding favorite:", error);
        }
      }
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
