"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RouteLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    // Listen for route changes
    handleStart();
    const timer = setTimeout(handleComplete, 100); // Small delay to show loader for quick navigations

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Circular Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-white border-b-gray-400 animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we prepare your content
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;
