import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Link from "next/link";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { HomeIcon, BuildingStorefrontIcon, HeartIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/lib/supabaseClient";

export const metadata: Metadata = {
  title: "Alira",
  description: "Personalized dining at UW–Madison",
};

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

// Global NavBar (Appears across all pages)
async function NavBar() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <nav className="w-full bg-green-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Home Link */}
        <Link href="/" className="flex items-center space-x-2">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xl font-bold">Alira</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/dining" className="flex items-center space-x-1 hover:text-green-200 transition">
            <BuildingStorefrontIcon className="w-5 h-5" />
            <span>Menus</span>
          </Link>

          <Link href="/favorites" className="flex items-center space-x-1 hover:text-green-200 transition">
            <HeartIcon className="w-5 h-5" />
            <span>Favorites</span>
          </Link>

          {/* Show Sign Out Button if User is Logged In */}
          {session && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/auth/signin";
              }}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Sign Out
            </button>
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
