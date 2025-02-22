"use client";
import { useState } from "react";
import MealCard from "@/components/MealCard";
import { meals } from "@/lib/meals";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

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

// Options
const diningHalls = ["Gordons", "Rhetas", "Fourlakes", "Lizs", "Carsons", "Dejope"];
const mealTimes = ["Breakfast", "Lunch", "Dinner"];
const dietaryFilters = ["Vegetarian", "Vegan", "Gluten-Free", "Pescatarian"];

export default function DiningPage() {
  const [selectedDate, setSelectedDate] = useState("2025-02-18");
  const [selectedHall, setSelectedHall] = useState("Gordons");
  const [selectedMealTime, setSelectedMealTime] = useState("Lunch");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Convert to keys for accessing meals
  const hallKey = selectedHall.toLowerCase();
  const timeKey = selectedMealTime.toLowerCase();

  // Go back/forward one day
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

  // Station data for the current selection
  const stations = meals[selectedDate]?.[timeKey]?.[hallKey] || [];

  // Toggle filter in/out of the selectedFilters
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="bg-white min-h-screen p-6 max-w-5xl mx-auto">
      {/* Title */}
      <h2 className="text-3xl font-bold text-green-700 text-center mb-2">Dining Hall Menus</h2>
      <p className="text-center text-gray-600 mb-6">
        Select a date, dining hall, and meal time. Apply dietary filters below.
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

      {/* Dining Hall Selector (Pill Style) */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {diningHalls.map((hall) => (
          <button
            key={hall}
            onClick={() => setSelectedHall(hall)}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition transform hover:scale-105 shadow
              ${
                selectedHall === hall
                  ? "bg-green-600 text-white"
                  : "bg-white border border-green-600 text-green-600 hover:bg-green-50"
              }
            `}
          >
            {hall}
          </button>
        ))}
      </div>

      {/* Meal Time Selector */}
      <div className="flex justify-center gap-4 mb-6">
        {mealTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedMealTime(time)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition transform hover:scale-105 shadow
              ${
                selectedMealTime === time
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-green-800"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Dietary Filters */}
      <div className="bg-green-50 p-5 rounded-lg shadow mb-8 max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-green-700 mb-3">Dietary Filters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dietaryFilters.map((filter) => (
            <label key={filter} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter)}
                onChange={() => toggleFilter(filter)}
                className="rounded"
              />
              <span className="text-sm text-green-700">{filter}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stations & Meals */}
      <div className="space-y-8">
        {stations.length > 0 ? (
          stations.map((station: any, index: number) => (
            <div key={index}>
              <h4 className="text-2xl font-semibold text-green-800 mb-3 border-b border-gray-300 pb-1">
                {station.station}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {station.items
                  .filter((meal: any) =>
                    selectedFilters.length === 0
                      ? true
                      : selectedFilters.every((f) => meal.tags.includes(f))
                  )
                  .map((meal: any) => (
                    <MealCard key={meal.id} {...meal} diningHall={selectedHall} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No stations available for this selection.</p>
        )}
      </div>
    </div>
  );
}
