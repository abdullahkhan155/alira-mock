// src/components/MealCard.tsx
"use client";
import { useFavorites } from "@/context/FavoritesContext";
import { HeartIcon } from "@heroicons/react/24/solid";

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

  return (
    <div className="p-4 bg-white rounded-md shadow hover:shadow-lg transition relative">
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
      <button
        onClick={() => toggleFavorite(id)}
        className={`absolute top-3 right-3 transition ${
          isFavorited ? "text-red-500" : "text-gray-400"
        } hover:scale-110`}
      >
        <HeartIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
