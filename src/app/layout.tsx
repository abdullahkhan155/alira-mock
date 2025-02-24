import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export const metadata: Metadata = {
  title: "Alira",
  description: "Personalized dining at UW–Madison",
};

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

// Global NavBar (Server Component)
async function NavBar() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <nav className="w-full bg-green-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Logo/Home */}
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-90 transition"
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-2xl font-bold">Alira</span>
        </Link>

        {/* Right: Menus, Favorites, Account */}
        <div className="flex items-center flex-wrap gap-6">
          {/* Menus Link */}
          <Link
            href="/dining"
            className="text-lg font-semibold flex items-center space-x-1 hover:text-green-200 transition"
          >
            <BuildingStorefrontIcon className="w-5 h-5" />
            <span>Menus</span>
          </Link>

          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="text-lg font-semibold flex items-center space-x-1 hover:text-green-200 transition"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Favorites</span>
          </Link>

          {/* Single "Account" Button */}
          {session ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center space-x-1 text-sm font-semibold border border-white rounded px-2 py-1 hover:bg-white/10 transition"
            >
              <UserIcon className="w-4 h-4" />
              <span>Account</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 text-sm font-semibold border border-white rounded px-2 py-1 hover:bg-white/10 transition"
            >
              <UserIcon className="w-4 h-4" />
              <span>Account</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${openSans.className} bg-gray-50`}>
        <FavoritesProvider>
          <NavBar />
          <main>{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  );
}
