"use client";
import { useFavorites } from "@/context/FavoritesContext";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

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

  // Called when the heart icon is clicked
  const handleFavoriteClick = () => {
    if (isFavorited) {
      // If already favorited, show a confirmation dialog to unfavorite
      setShowConfirm(true);
    } else {
      // If not favorited, animate + favorite
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
        className={`absolute top-3 right-3 transition transform hover:scale-110 ${
          isFavorited ? "text-red-500" : "text-gray-400"
        }`}
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
