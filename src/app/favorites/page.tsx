// src/app/favorites/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { meals } from "@/lib/meals";
import MealCard from "@/components/MealCard";
import { HeartIcon } from "@heroicons/react/24/solid";

function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const mealTimes = ["Breakfast", "Lunch", "Dinner"];

// Flatten data for search
const allMeals = Object.entries(meals)
  .flatMap(([date, mealTypes]) =>
    Object.entries(mealTypes).flatMap(([mealTime, halls]) =>
      Object.entries(halls).flatMap(([hall, stations]) =>
        stations.flatMap((station: any) =>
          station.items.map((item: any) => ({
            ...item,
            diningHall: hall.charAt(0).toUpperCase() + hall.slice(1),
          }))
        )
      )
    )
  );

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const [selectedDate, setSelectedDate] = useState("2025-02-18");
  const [selectedTime, setSelectedTime] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeKey = selectedTime.toLowerCase();
  const halls = meals[selectedDate]?.[timeKey] || {};
  const favoritedMeals = Object.entries(halls).flatMap(([hall, stations]) =>
    stations.flatMap((station: any) =>
      station.items
        .filter((item: any) => favorites.includes(item.id))
        .map((item: any) => ({
          ...item,
          diningHall: hall.charAt(0).toUpperCase() + hall.slice(1),
        }))
    )
  );

  // Search
  const searchResults = allMeals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrevDay = () => {
    const dateObj = parseDate(selectedDate);
    dateObj.setDate(dateObj.getDate() - 1);
    setSelectedDate(formatDate(dateObj));
  };
  const handleNextDay = () => {
    const dateObj = parseDate(selectedDate);
    dateObj.setDate(dateObj.getDate() + 1);
    setSelectedDate(formatDate(dateObj));
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Your Favorite Meals</h1>
      <p className="text-center text-gray-600">
        Select a date and meal time to see your favorites. Use the search to add more!
      </p>

      {/* Date + Arrows */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={handlePrevDay}
          className="px-3 py-2 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300"
        >
          &larr;
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md shadow-sm"
        />
        <button
          onClick={handleNextDay}
          className="px-3 py-2 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300"
        >
          &rarr;
        </button>
      </div>

      {/* Meal Time Selector */}
      <div className="flex justify-center gap-4 mt-6">
        {mealTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-5 py-2 rounded-full shadow font-semibold transition transform hover:scale-105 ${
              selectedTime === time ? "bg-primary text-white" : "bg-gray-200 text-foreground"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Search + Dropdown */}
      <div className="relative mt-6 max-w-xl mx-auto" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search and add meals..."
            className="w-full p-3 border rounded-md"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
          />
          {/* X button to clear the search */}
          {search.length > 0 && (
            <button
              onClick={() => {
                setSearch("");
                setShowDropdown(false);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute w-full bg-white shadow-lg border rounded-md mt-1 max-h-48 overflow-y-auto z-10">
            {searchResults.map((meal: any) => (
              <button
                key={meal.id}
                onClick={() => toggleFavorite(meal.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-200 flex justify-between items-center"
              >
                <span>{meal.name}</span>
                {favorites.includes(meal.id) ? (
                  <HeartIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Meals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {favoritedMeals.length > 0 ? (
          favoritedMeals.map((meal: any) => <MealCard key={meal.id} {...meal} />)
        ) : (
          <p className="text-center text-gray-500 mt-6">No favorites selected.</p>
        )}
      </div>
    </div>
  );
}
