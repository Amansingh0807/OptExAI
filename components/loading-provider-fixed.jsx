"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef(null);
  const isInitialLoad = useRef(true);
  const navigationStarted = useRef(false);

  const startLoading = () => {
    if (!navigationStarted.current) {
      navigationStarted.current = true;
      setIsLoading(true);
    }
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
    navigationStarted.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle route changes
  useEffect(() => {
    // Don't show loader on very first page load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // If navigation hasn't started yet, start it
    if (!navigationStarted.current) {
      startLoading();
    }
    
    // Stop loading after a very short delay once route changes
    timeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 200); // Very short delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  // Intercept link clicks for immediate loading
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a[href]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
        return;
      }

      // Only handle internal Next.js routes
      if (href.startsWith('/')) {
        startLoading();
      }
    };

    // Use capture phase to ensure we catch the click before navigation
    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <GlobalLoader />}
    </LoadingContext.Provider>
  );
};

const GlobalLoader = () => {
  const [progress, setProgress] = useState(10); // Start at 10% immediately

  useEffect(() => {
    // Rapid initial progress
    const rapidInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 80) {
          clearInterval(rapidInterval);
          return prev;
        }
        return prev + Math.random() * 20 + 10; // Faster initial progress
      });
    }, 50); // Much faster updates

    // Slower final progress
    const slowInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Stop at 95%
        return prev + Math.random() * 3;
      });
    }, 200);

    return () => {
      clearInterval(rapidInterval);
      clearInterval(slowInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50/98 via-white/99 to-blue-50/98 dark:from-gray-950/99 dark:via-black/99 dark:to-slate-900/98 backdrop-blur-xl transition-opacity duration-200">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-float-1"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400/20 rounded-full animate-float-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-float-3"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gray-400/25 rounded-full animate-float-4"></div>
      </div>

      {/* Modern Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent dark:via-gray-700/50 z-[10000]">
        <div 
          className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-300 ease-out shadow-lg relative overflow-hidden"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-10 animate-fade-in-up">
        
        {/* Sophisticated Multi-Ring Loader */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          
          {/* Outer Pulsing Ring */}
          <div className="absolute w-36 h-36 rounded-full border border-green-200/30 dark:border-green-500/20 animate-ping"></div>
          
          {/* Main Rotating Rings */}
          <div className="relative w-28 h-28 rounded-full">
            
            {/* Outer Ring - Green with Gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-spin-slow">
              <div className="w-full h-full rounded-full border-3 border-transparent border-t-green-500 border-r-green-400/50 shadow-lg shadow-green-500/20"></div>
            </div>
            
            {/* Middle Ring - Blue/White with Glow */}
            <div className="absolute inset-3 w-22 h-22 rounded-full bg-gradient-to-r from-blue-50/30 to-white/40 dark:from-gray-800/30 dark:to-gray-700/40 animate-spin shadow-xl">
              <div className="w-full h-full rounded-full border-3 border-transparent border-t-white dark:border-t-gray-200 border-r-blue-400/60 filter blur-[0.5px]"></div>
            </div>
            
            {/* Inner Ring - Purple/Gray with Neon Effect */}
            <div className="absolute inset-6 w-16 h-16 rounded-full bg-gradient-to-r from-gray-100/40 to-slate-200/40 dark:from-gray-700/40 dark:to-gray-600/40 animate-spin-slow shadow-2xl">
              <div className="w-full h-full rounded-full border-3 border-transparent border-t-gray-500 border-r-purple-400/60 shadow-lg shadow-purple-500/10"></div>
            </div>
            
            {/* Center Orb with Glow */}
            <div className="absolute inset-1/2 w-5 h-5 -ml-2.5 -mt-2.5 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-pulse-glow shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          
          {/* Orbiting Dots */}
          <div className="absolute w-32 h-32 animate-spin-orbit">
            <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-1.25 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
            <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 -ml-1.25 bg-gray-500 rounded-full shadow-lg shadow-gray-500/50"></div>
            <div className="absolute left-0 top-1/2 w-2.5 h-2.5 -mt-1.25 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            <div className="absolute right-0 top-1/2 w-2.5 h-2.5 -mt-1.25 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
          </div>
        </div>

        {/* Modern OptEx Branding */}
        <div className="text-center space-y-5">
          <div className="relative">
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 bg-clip-text text-transparent animate-pulse-glow tracking-tight">
              OptEx
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-2xl blur-xl animate-glow"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
              Financial Intelligence
            </p>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg shadow-green-500/30"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce shadow-lg shadow-blue-500/30" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg shadow-purple-500/30" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>
        </div>

        {/* Dynamic Loading Messages */}
        <div className="text-center max-w-md">
          <LoadingMessages />
        </div>
      </div>
    </div>
  );
};

const LoadingMessages = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    { text: "Loading page...", icon: "🚀" },
    { text: "Preparing content...", icon: "📊" },
    { text: "Almost ready...", icon: "✨" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800); // Faster rotation for short loading

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="text-center space-y-2 animate-fade-in-up">
      <div className="flex items-center justify-center space-x-2 min-h-[1.5rem]">
        <span className="text-lg animate-bounce">
          {messages[messageIndex].icon}
        </span>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-500 ease-in-out">
          {messages[messageIndex].text}
        </p>
      </div>
      
      {/* Message Progress Dots */}
      <div className="flex justify-center space-x-1.5">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === messageIndex
                ? "bg-gradient-to-r from-green-400 to-blue-500 scale-125"
                : "bg-gray-300/50 dark:bg-gray-600/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
