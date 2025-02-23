"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-green-700">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded-md mt-4"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded-md mt-4"
        />

        {isSignUp && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-md mt-4"
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <p className="mt-4 text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-green-600 cursor-pointer font-semibold ml-1"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>

        <button onClick={onClose} className="mt-3 text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
}
