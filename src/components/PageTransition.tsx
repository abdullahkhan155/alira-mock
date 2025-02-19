"use client";
import { ReactNode, useEffect, useState } from "react";

/**
 * PageTransition wraps your page content in a fade + slide effect.
 * On initial mount or route change, the content smoothly appears.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger the fade-in after the component mounts
    setMounted(true);
  }, []);

  return (
    <div
      className={`
        transition-all 
        duration-500 
        ease-in-out 
        transform
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {children}
    </div>
  );
}
