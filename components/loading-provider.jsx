"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

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
  const router = useRouter();

  const startLoading = () => {
    setIsLoading(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const stopLoading = () => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Handle route changes
  useEffect(() => {
    startLoading();
    
    // Set timeout to stop loading
    timeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 1200); // Increased time for better UX

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  // Intercept all link clicks to start loading immediately
  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Check if it's an internal link
      if (href.startsWith('/') || href.includes(window.location.origin)) {
        startLoading();
      }
    };

    // Attach click listener to document
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  // Also handle programmatic navigation
  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      startLoading();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      startLoading();
      return originalReplace.apply(router, args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <GlobalLoader />}
    </LoadingContext.Provider>
  );
};

const GlobalLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50/95 via-white/98 to-blue-50/95 dark:from-gray-950/98 dark:via-black/98 dark:to-slate-900/95 backdrop-blur-xl">
      
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
          className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-12 animate-fade-in-up">
        
        {/* Sophisticated Multi-Ring Loader */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          
          {/* Outer Pulsing Ring */}
          <div className="absolute w-40 h-40 rounded-full border border-green-200/30 dark:border-green-500/20 animate-ping"></div>
          
          {/* Main Rotating Rings */}
          <div className="relative w-32 h-32 rounded-full">
            
            {/* Outer Ring - Green with Gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-spin-slow">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-green-500 border-r-green-400/50 shadow-lg shadow-green-500/20"></div>
            </div>
            
            {/* Middle Ring - Blue/White with Glow */}
            <div className="absolute inset-4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-50/30 to-white/40 dark:from-gray-800/30 dark:to-gray-700/40 animate-spin shadow-xl">
              <div className="w-full h-full rounded-full border-3 border-transparent border-t-white dark:border-t-gray-200 border-r-blue-400/60 filter blur-[0.5px]"></div>
            </div>
            
            {/* Inner Ring - Purple/Gray with Neon Effect */}
            <div className="absolute inset-8 w-16 h-16 rounded-full bg-gradient-to-r from-gray-100/40 to-slate-200/40 dark:from-gray-700/40 dark:to-gray-600/40 animate-spin-slow shadow-2xl">
              <div className="w-full h-full rounded-full border-3 border-transparent border-t-gray-500 border-r-purple-400/60 shadow-lg shadow-purple-500/10"></div>
            </div>
            
            {/* Center Orb with Glow */}
            <div className="absolute inset-1/2 w-6 h-6 -ml-3 -mt-3 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-pulse-glow shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          
          {/* Orbiting Dots */}
          <div className="absolute w-36 h-36 animate-spin-orbit">
            <div className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
            <div className="absolute bottom-0 left-1/2 w-3 h-3 -ml-1.5 bg-gray-500 rounded-full shadow-lg shadow-gray-500/50"></div>
            <div className="absolute left-0 top-1/2 w-3 h-3 -mt-1.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
            <div className="absolute right-0 top-1/2 w-3 h-3 -mt-1.5 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
          </div>
        </div>

        {/* Modern OptEx Branding */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 bg-clip-text text-transparent animate-pulse-glow tracking-tight">
              OptEx
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-2xl blur-xl animate-glow"></div>
          </div>
          
          <div className="space-y-3">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
              Financial Intelligence
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
              Crafting your personalized financial experience
            </p>
          </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg shadow-green-500/30"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce shadow-lg shadow-blue-500/30" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg shadow-purple-500/30" style={{ animationDelay: "0.4s" }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-bounce shadow-lg shadow-gray-500/30" style={{ animationDelay: "0.6s" }}></div>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider uppercase">
              Loading Complete
            </div>
          </div>
        </div>

        {/* Dynamic Loading Messages */}
        <div className="text-center max-w-md">
          <LoadingMessages />
        </div>

        {/* Modern Loading Bar */}
        <div className="w-80 h-2 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-slide-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingMessages = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    { text: "Initializing secure connection...", icon: "🔐" },
    { text: "Loading financial dashboard...", icon: "📊" },
    { text: "Synchronizing your data...", icon: "🔄" },
    { text: "Preparing analytics engine...", icon: "⚡" },
    { text: "Optimizing performance...", icon: "🚀" },
    { text: "Almost ready for takeoff...", icon: "✨" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="text-center space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-center space-x-3 min-h-[2rem]">
        <span className="text-2xl animate-bounce">
          {messages[messageIndex].icon}
        </span>
        <p className="text-base font-medium text-gray-600 dark:text-gray-300 transition-all duration-700 ease-in-out">
          {messages[messageIndex].text}
        </p>
      </div>
      
      {/* Message Progress Dots */}
      <div className="flex justify-center space-x-2">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
