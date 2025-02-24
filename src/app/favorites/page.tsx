"use client";
import { useState, useRef, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { meals } from "@/lib/meals";
import MealCard from "@/components/MealCard";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

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
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedTime, setSelectedTime] = useState("Lunch");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        router.push("/login");
      }
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const timeKey = selectedTime.toLowerCase();
  const halls = meals[selectedDate]?.[timeKey] || {};

  // **Group favorites by dining hall (now properly capitalized)**
  const groupedFavorites: Record<string, any[]> = {};
  Object.entries(halls).forEach(([hall, stations]) => {
    stations.forEach((station: any) => {
      station.items.forEach((item: any) => {
        if (favorites.includes(item.id)) {
          const capitalizedHall = hall.charAt(0).toUpperCase() + hall.slice(1);
          if (!groupedFavorites[capitalizedHall]) {
            groupedFavorites[capitalizedHall] = [];
          }
          groupedFavorites[capitalizedHall].push({ ...item, diningHall: capitalizedHall });
        }
      });
    });
  });

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
      <h2 className="text-3xl font-bold text-green-700 text-center mb-2">
        Your Favorite Meals
      </h2>
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
                ${selectedTime === time ? "bg-green-600 text-white" : "bg-gray-200 text-green-800"}`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Search + Dropdown */}
      <div className="relative max-w-xl mx-auto mb-6" ref={dropdownRef}>
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
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute w-full bg-white shadow-lg border rounded-md mt-1 max-h-48 overflow-y-auto z-10">
            {searchResults.map((meal: any) => (
              <button
                key={meal.id}
                onClick={() => toggleFavorite(meal.id)}
                className="w-full text-left px-4 py-2 hover:bg-green-50 flex justify-between items-center"
              >
                <span>{meal.name}</span>
                <HeartIcon className={`w-5 h-5 ${favorites.includes(meal.id) ? "text-red-500" : "text-gray-400"}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Meals */}
      {Object.entries(groupedFavorites).length > 0 ? (
        Object.entries(groupedFavorites).map(([hall, meals]) => (
          <div key={hall} className="mb-8">
            <h3 className="text-2xl font-bold text-green-800 mb-3">{hall}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal: any) => <MealCard key={meal.id} {...meal} />)}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No favorites selected.</p>
      )}
    </div>
  );
}
