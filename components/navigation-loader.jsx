"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    // Start loading
    startLoading();

    // Stop loading after a short delay
    const timer = setTimeout(stopLoading, 500);

    return () => {
      clearTimeout(timer);
      stopLoading();
    };
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse progress-bar"></div>
      </div>

      {/* Full Screen Overlay with Circular Loader */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-6">
          {/* Multi-color Circular Loader */}
          <div className="relative w-20 h-20">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            
            {/* Animated Ring with Multiple Colors */}
            <div className="absolute inset-0 rounded-full animate-spin">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-green-500 border-r-white border-b-gray-500"></div>
            </div>
            
            {/* Inner Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-gray-100 dark:border-gray-600 animate-spin-slow">
              <div className="w-full h-full rounded-full border-2 border-transparent border-t-gray-400 border-r-green-400"></div>
            </div>
          </div>
          
          {/* Loading Content */}
          <div className="text-center animate-pulse">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Loading OptEx
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Preparing your financial dashboard...
            </p>
          </div>

          {/* Animated Dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationLoader;
