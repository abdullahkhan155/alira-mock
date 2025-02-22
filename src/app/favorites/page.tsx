"use client";
import { useState, useRef, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { meals } from "@/lib/meals";
import MealCard from "@/components/MealCard";
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

// Date helpers
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

const mealTimes = ["Breakfast", "Lunch", "Dinner"];

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const [selectedDate, setSelectedDate] = useState("2025-02-18");
  const [selectedTime, setSelectedTime] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeKey = selectedTime.toLowerCase();
  const halls = meals[selectedDate]?.[timeKey] || {};

  // Collect all favorited meals for this date + time
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

  // Group favorites by dining hall
  const favoritesByHall = favoritedMeals.reduce((acc: any, meal: any) => {
    const hall = meal.diningHall || "Unknown Hall";
    if (!acc[hall]) {
      acc[hall] = [];
    }
    acc[hall].push(meal);
    return acc;
  }, {});

  // Search results
  const searchResults = allMeals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // Date Navigation
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-2">Your Favorite Meals</h2>
      <p className="text-center text-gray-600 mb-6">
        Select a date and meal time to see your favorites. Use the search to add more!
      </p>

      {/* Date Picker + Arrows */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={handlePrevDay}
          className="p-2 bg-green-100 text-green-700 rounded-full shadow hover:bg-green-200 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border border-green-300 rounded-md shadow-sm"
        />
        <button
          onClick={handleNextDay}
          className="p-2 bg-green-100 text-green-700 rounded-full shadow hover:bg-green-200 transition"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Meal Time Selector */}
      <div className="flex justify-center gap-4 mb-6">
        {mealTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-5 py-2 rounded-full font-semibold transition transform hover:scale-105 shadow
              ${
                selectedTime === time
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-green-800"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Search + Dropdown (More Prominent) */}
      <div className="relative max-w-xl mx-auto mb-6" ref={dropdownRef}>
        <div className="relative">
          {/* Larger input, green border, and placeholder icon */}
          <div className="flex items-center border-2 border-green-400 rounded-md overflow-hidden">
            <MagnifyingGlassIcon className="w-6 h-6 text-green-600 ml-2" />
            <input
              type="text"
              placeholder="Search for meals to add..."
              className="w-full p-3 text-green-800 focus:outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
            />
            {search.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setShowDropdown(false);
                }}
                className="text-gray-400 hover:text-gray-600 px-3"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Search Dropdown */}
        {showDropdown && (
          <div className="absolute w-full bg-white shadow-lg border rounded-md mt-1 max-h-48 overflow-y-auto z-10">
            {searchResults.map((meal: any) => (
              <button
                key={meal.id}
                onClick={() => toggleFavorite(meal.id)}
                className="w-full text-left px-4 py-2 hover:bg-green-50 flex justify-between items-center"
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

      {/* Grouped Favorites by Dining Hall */}
      {Object.keys(favoritesByHall).length > 0 ? (
        Object.entries(favoritesByHall).map(([hallName, hallMeals]: any) => (
          <div key={hallName} className="mb-8">
            {/* Dining Hall Heading */}
            <h3 className="text-2xl font-bold text-green-700 mb-3 border-b border-gray-300 pb-1">
              {hallName}
            </h3>
            {/* Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallMeals.map((meal: any) => (
                <MealCard key={meal.id} {...meal} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">No favorites selected.</p>
      )}
    </div>
  );
}
