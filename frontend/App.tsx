import React, { useState, useEffect } from 'react';
import { Compass, Map, Moon, Sun } from 'lucide-react';
import { TripForm } from './components/TripForm';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { generateItinerary } from './services/gemini';
import { TripRequest, Itinerary } from './types';

export default function App() {
  const [currentRequest, setCurrentRequest] = useState<TripRequest | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleInitialSubmit = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    setCurrentRequest(request);
    
    try {
      const newItinerary = await generateItinerary(request);
      setItinerary(newItinerary);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async (tweak: string) => {
    if (!currentRequest || !itinerary) return;
    
    setIsRefining(true);
    setError(null);
    
    try {
      const updatedItinerary = await generateItinerary(currentRequest, itinerary, tweak);
      setItinerary(updatedItinerary);
    } catch (err: any) {
      setError(err.message || "Failed to update itinerary.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Wanderlust AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex text-sm text-slate-500 dark:text-slate-400 font-medium items-center gap-1">
              Powered by Gemini <SparklesIcon className="w-4 h-4 text-brand-500" />
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-slate-400 hover:text-amber-400 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-slate-500 hover:text-indigo-500 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Form */}
          <div className={`w-full lg:w-1/3 flex-shrink-0 transition-all duration-500 ${itinerary ? 'lg:sticky lg:top-24 self-start' : 'max-w-xl mx-auto'}`}>
            {!itinerary && (
              <div className="text-center mb-8 lg:hidden">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Design Your Dream Trip</h2>
                <p className="text-slate-600 dark:text-slate-400">AI-powered itineraries tailored to your exact preferences.</p>
              </div>
            )}
            <TripForm onSubmit={handleInitialSubmit} isLoading={isLoading} />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Panel: Results */}
          <div className="w-full lg:w-2/3 flex-grow flex flex-col">
            {isLoading && !itinerary ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-brand-200 dark:bg-brand-900/50 animate-pulse"></div>
                  <Map className="w-16 h-16 text-brand-500 relative z-10 animate-bounce" />
                </div>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Scouring the globe for the best spots...</p>
              </div>
            ) : itinerary && currentRequest ? (
              <div className="flex flex-col h-full">
                {/* Content Area */}
                <div className="flex-grow">
                  <ItineraryDisplay 
                    itinerary={itinerary} 
                    onRefine={handleRefine} 
                    isRefining={isRefining} 
                  />
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex h-full min-h-[600px] flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                <Map className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Your itinerary will appear here</p>
                <p className="text-sm mt-2 max-w-sm text-center">Fill out the form on the left to generate a personalized travel plan.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

// Simple inline icon for header
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
