// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4">Alira Mock</h1>
      <p className="text-md text-gray-600 mb-6">Find your favorite meals</p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Both Buttons Use Lighter Green (Secondary) */}
        <Link
          href="/dining"
          className="px-6 py-3 bg-secondary text-foreground font-semibold rounded-lg shadow-md hover:bg-green-300 transition"
        >
          Browse Dining Halls
        </Link>
        <Link
          href="/favorites"
          className="px-6 py-3 bg-secondary text-foreground font-semibold rounded-lg shadow-md hover:bg-green-300 transition"
        >
          View Favorites
        </Link>
      </div>
    </div>
  );
}
