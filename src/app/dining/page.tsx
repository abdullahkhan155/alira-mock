"use client";
import { useState } from "react";
import MealCard from "@/components/MealCard";
import { meals } from "@/lib/meals";

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

// 6 dining halls, 3 meal times
const diningHalls = ["Gordons", "Rhetas", "Fourlakes", "Lizs", "Carsons", "Dejope"];
const mealTimes = ["Breakfast", "Lunch", "Dinner"];

// Dietary filters
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

  // Toggle a filter in/out of the selectedFilters array
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Dining Hall Menus</h1>
      <p className="text-center text-gray-600">
        Select a date, dining hall, and meal time. Apply dietary filters below.
      </p>

      {/* Date Picker + Arrows */}
      <div className="flex items-center justify-center mt-6 gap-2">
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

      {/* Dining Hall Selector (Pill Style, Outline if not selected) */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {diningHalls.map((hall) => (
          <button
            key={hall}
            onClick={() => setSelectedHall(hall)}
            className={`px-5 py-2 text-sm font-semibold transition transform hover:scale-105 rounded-full 
              ${
                selectedHall === hall
                  ? "bg-primary text-white shadow"
                  : "border border-primary text-primary bg-white"
              }
            `}
          >
            {hall}
          </button>
        ))}
      </div>

      {/* Meal Time Selector (Rounded-md, Different Color Logic) */}
      <div className="flex justify-center gap-4 mt-6">
        {mealTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedMealTime(time)}
            className={`px-4 py-2 rounded-md text-sm shadow font-medium transition transform hover:scale-105
              ${
                selectedMealTime === time
                  ? "bg-foreground text-white"
                  : "bg-gray-200 text-foreground"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Dietary Filters */}
      <div className="mt-6 bg-white p-5 rounded shadow max-w-xl mx-auto">
        <h2 className="text-lg font-bold mb-3">Dietary Filters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {dietaryFilters.map((filter) => (
            <label key={filter} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter)}
                onChange={() => toggleFilter(filter)}
              />
              <span className="text-sm">{filter}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stations & Meals */}
      <div className="mt-10 space-y-8">
        {stations.length > 0 ? (
          stations.map((station: any, index: number) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-3 border-b border-gray-300 pb-1">
                {station.station}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {station.items
                  .filter((meal: any) => {
                    if (selectedFilters.length === 0) return true;
                    return selectedFilters.every((f) => meal.tags.includes(f));
                  })
                  .map((meal: any) => (
                    <MealCard key={meal.id} {...meal} diningHall={selectedHall} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No stations available for this selection.</p>
        )}
      </div>
    </div>
  );
}
