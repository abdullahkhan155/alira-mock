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
  UserPlusIcon,
} from "@heroicons/react/24/solid";

export default function NavBar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // 1) Fetch current session
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("NavBar session from supabase:", data.session); // DEBUG
      setSession(data.session);
    };
    fetchSession();

    // 2) Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("NavBar onAuthStateChange => newSession:", newSession); // DEBUG
        setSession(newSession);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    console.log("Signed out. Session should be null now.");
    setSession(null);
    router.push("/");
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
          <Link
            href="/dining"
            className="flex items-center space-x-1 hover:text-green-200 transition"
          >
            <BuildingStorefrontIcon className="w-5 h-5" />
            <span>Menus</span>
          </Link>

          <Link
            href="/favorites"
            className="flex items-center space-x-1 hover:text-green-200 transition"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Favorites</span>
          </Link>

          {/* Show Sign Out if we have a session; otherwise show Sign In / Sign Up */}
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              <UserIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex space-x-4">
              {/* Sign In */}
              <Link
                href="/auth/signin"
                className="flex items-center space-x-1 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                <UserIcon className="w-5 h-5" />
                <span>Sign In</span>
              </Link>

              {/* Sign Up */}
              <Link
                href="/auth/signup"
                className="flex items-center space-x-1 bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
