import React, { useState, useCallback } from 'react';
import { MapPin, Calendar, IndianRupee, Heart, AlertCircle, Sparkles, PlaneTakeoff, Users } from 'lucide-react';
import { TripRequest } from '../types';

interface TripFormProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
}

const PREDEFINED_INTERESTS = [
  'Culture & History',
  'Food & Culinary',
  'Nature & Wildlife',
  'Adventure & Sports',
  'Relaxation & Wellness',
  'Nightlife & Entertainment',
  'Shopping',
  'Art & Museums'
];

export const TripForm: React.FC<TripFormProps> = React.memo(({ onSubmit, isLoading }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState<number>(3);
  const [travelers, setTravelers] = useState<number>(2);
  const [budgetMin, setBudgetMin] = useState<number | ''>('');
  const [budgetMax, setBudgetMax] = useState<number | ''>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState('');
  const [constraints, setConstraints] = useState('');

  const toggleInterest = useCallback((interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    
    const allInterests = [...selectedInterests];
    if (customInterests.trim()) {
      allInterests.push(customInterests.trim());
    }

    onSubmit({
      origin,
      destination,
      duration,
      travelers,
      budgetMin,
      budgetMax,
      interests: allInterests,
      constraints
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6 transition-colors duration-200" aria-label="Trip Planning Form">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">Plan Your Next Adventure</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tell us where you're starting and where you want to go.</p>
      </div>

      <div className="space-y-5">
        {/* Origin & Destination */}
        <div className="space-y-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Origin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <PlaneTakeoff className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="origin"
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                placeholder="e.g., New Delhi, India"
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="destination"
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                placeholder="e.g., Jaipur, India"
                aria-required="true"
              />
            </div>
          </div>
        </div>

        {/* Duration & Travelers Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Days)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="duration"
                type="number"
                min="1"
                max="30"
                required
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>
          </div>
          <div>
            <label htmlFor="travelers" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Travelers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <Users className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="travelers"
                type="number"
                min="1"
                max="20"
                required
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors"
                aria-required="true"
              />
            </div>
          </div>
        </div>

        {/* Budget Row */}
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Range in INR (Optional)</legend>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <label htmlFor="budgetMin" className="sr-only">Minimum Budget</label>
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none" aria-hidden="true">
                <IndianRupee className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="budgetMin"
                type="number"
                min="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="block w-full pl-7 pr-2 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                placeholder="Min"
              />
            </div>
            <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">-</span>
            <div className="relative flex-1">
              <label htmlFor="budgetMax" className="sr-only">Maximum Budget</label>
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none" aria-hidden="true">
                <IndianRupee className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                id="budgetMax"
                type="number"
                min={budgetMin === '' ? 0 : budgetMin}
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="block w-full pl-7 pr-2 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                placeholder="Max"
              />
            </div>
          </div>
        </fieldset>

        {/* Interests */}
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interests & Vibes</legend>
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Select predefined interests">
            {PREDEFINED_INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={selectedInterests.includes(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 dark:focus:ring-offset-slate-800 ${
                  selectedInterests.includes(interest)
                    ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="relative">
            <label htmlFor="customInterests" className="sr-only">Custom Interests</label>
            <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none" aria-hidden="true">
              <Heart className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <textarea
              id="customInterests"
              rows={2}
              value={customInterests}
              onChange={(e) => setCustomInterests(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              placeholder="Any other specific interests? (e.g., local street food, relaxing cafes)"
            />
          </div>
        </fieldset>

        {/* Constraints */}
        <div>
          <label htmlFor="constraints" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Constraints & Requirements</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none" aria-hidden="true">
              <AlertCircle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <textarea
              id="constraints"
              rows={2}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              placeholder="e.g., Vegetarian, no early mornings, wheelchair accessible"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !origin.trim() || !destination.trim()}
        aria-busy={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center" aria-live="polite">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Crafting Itinerary...
          </span>
        ) : (
          <span className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
            Plan Trip
          </span>
        )}
      </button>
    </form>
  );
});

TripForm.displayName = 'TripForm';
