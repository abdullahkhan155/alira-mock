"use client";
import Link from "next/link";
import { FaUtensils, FaStar } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-24 text-gray-900">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-green-700 mb-3">Alira</h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-6">Find your favorite meals</p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <Link href="/dining">
          <button className="flex items-center px-6 py-3 bg-green-600 text-white text-lg rounded-md shadow-md hover:bg-green-700 transition-colors">
            <FaUtensils className="mr-2" />
            Browse Dining Halls
          </button>
        </Link>

        <Link href="/favorites">
          <button className="flex items-center px-6 py-3 bg-green-600 text-white text-lg rounded-md shadow-md hover:bg-green-700 transition-colors">
            <FaStar className="mr-2" />
            View Favorites
          </button>
        </Link>
      </div>
    </div>
  );
}
