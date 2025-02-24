"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function NavBar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoadingSession(false);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/login");
  };

  return (
    <nav className="bg-green-600 text-white py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
        {/* Left: Logo/Home */}
        <Link href="/" className="flex items-center space-x-2">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xl font-bold">Alira</span>
        </Link>

        {/* Right: Nav Links + Auth */}
        <div className="flex space-x-6 items-center">
          <Link href="/dining" className="flex items-center space-x-1 hover:text-green-200 transition">
            <BuildingStorefrontIcon className="w-5 h-5" />
            <span>Menus</span>
          </Link>
          <Link href="/favorites" className="flex items-center space-x-1 hover:text-green-200 transition">
            <HeartIcon className="w-5 h-5" />
            <span>Favorites</span>
          </Link>

          {/* Show Sign Out if logged in; otherwise show Sign In */}
          {loadingSession ? (
            <span className="text-sm">Loading...</span>
          ) : session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link href="/login" className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">
              <UserIcon className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
