// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import { FavoritesProvider } from "@/context/FavoritesContext";

export const metadata: Metadata = {
  title: "Alira Mock",
  description: "Personalized dining at UW–Madison",
};

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

// Updated NavBar: "Menus" instead of "Dining"
function NavBar() {
  return (
    <nav className="w-full bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo / Title */}
        <div className="font-bold text-lg">Alira Mock</div>

        {/* Nav Links */}
        <div className="mt-2 sm:mt-0 flex gap-4">
          <Link
            href="/"
            className="px-3 py-2 rounded-md hover:bg-foreground transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/dining"
            className="px-3 py-2 rounded-md hover:bg-foreground transition font-medium"
          >
            Menus
          </Link>
          <Link
            href="/favorites"
            className="px-3 py-2 rounded-md hover:bg-foreground transition font-medium"
          >
            Favorites
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} bg-background text-foreground`}>
        <FavoritesProvider>
          <NavBar />
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
