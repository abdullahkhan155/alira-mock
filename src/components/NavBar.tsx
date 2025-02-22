"use client";
import Link from "next/link";
import { HomeIcon, BuildingStorefrontIcon, HeartIcon } from "@heroicons/react/24/solid";

export default function NavBar() {
  return (
    <nav className="bg-green-600 text-white py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
        {/* Logo / Home Link */}
        <Link href="/" className="flex items-center space-x-2">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xl font-bold">Alira</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link
            href="/dining"
            className="flex items-center space-x-1 hover:text-green-200 transition"
          >
            <BuildingStorefrontIcon className="w-5 h-5" />
            <span>Dining</span>
          </Link>

          <Link
            href="/favorites"
            className="flex items-center space-x-1 hover:text-green-200 transition"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
