"use client";
import { useFavorites } from "@/context/FavoritesContext";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface MealProps {
  id: string;
  name: string;
  calories: number;
  tags: string[];
  diningHall?: string;
}

export default function MealCard({ id, name, calories, tags, diningHall }: MealProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.includes(id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const router = useRouter();

  // Fetch session and watch for changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoadingSession(false);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Handle click on the favorite button
  const handleFavoriteClick = () => {
    if (!session) {
      router.push("/login"); // Redirect to login page
      return;
    }

    if (isFavorited) {
      setShowConfirm(true);
    } else {
      animateFavorite();
      toggleFavorite(id);
    }
  };

  // If user confirms "Yes, Unfavorite"
  const confirmUnfavorite = (confirm: boolean) => {
    setShowConfirm(false);
    if (confirm) {
      toggleFavorite(id);
    }
  };

  // Quick "pop" animation for favoriting
  const animateFavorite = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow hover:shadow-lg transition relative">
      {/* Meal Info */}
      <h3 className="text-lg font-bold text-foreground">{name}</h3>
      {diningHall && (
        <p className="text-sm font-semibold text-primary mt-1">{diningHall}</p>
      )}
      <p className="text-sm text-gray-600 mt-1">{calories} cal</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-secondary text-foreground rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Favorite (Heart) Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={loadingSession} // Prevents undefined session issues
        className={`absolute top-3 right-3 transition transform hover:scale-110 ${
          isFavorited ? "text-red-500" : "text-gray-400"
        } ${loadingSession ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <HeartIcon
          className={`w-6 h-6 transition-transform ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
        />
      </button>

      {/* Confirmation Overlay for Unfavoriting */}
      {showConfirm && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-3">Remove from favorites?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmUnfavorite(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => confirmUnfavorite(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
