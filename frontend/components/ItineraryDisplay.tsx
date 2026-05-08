import React, { useState, useCallback } from 'react';
import { Clock, MapPin, IndianRupee, ChevronDown, ChevronUp, Send, Timer, Bed, Utensils, Train, Plane, Bus, Car, Map as MapIcon, Save } from 'lucide-react';
import { Itinerary, DayPlan, Activity } from '../types';
import { MapView } from './MapView';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onRefine: (tweak: string) => void;
  isRefining: boolean;
}

const ActivityCard: React.FC<{ activity: Activity; onShowMap: (query: string) => void }> = React.memo(({ activity, onShowMap }) => (
  <div className="relative pl-8 py-4 group">
    <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-last:bottom-auto group-last:h-full transition-colors" aria-hidden="true"></div>
    <div className="absolute left-0 top-5 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 bg-brand-500 shadow-sm transition-colors" aria-hidden="true"></div>
    
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white">{activity.title}</h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onShowMap(`${activity.title}, ${activity.location}`)}
            className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
            title="View on Map"
          >
            <MapIcon className="w-4 h-4" />
          </button>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 whitespace-nowrap transition-colors">
            <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
            <span className="sr-only">Time: </span>{activity.time}
          </span>
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{activity.description}</p>
      
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center">
          <Timer className="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="sr-only">Duration: </span>{activity.duration}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="sr-only">Location: </span>{activity.location}
        </div>
        <div className="flex items-center">
          <IndianRupee className="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <span className="sr-only">Estimated Cost: </span>{activity.estimatedCost}
        </div>
      </div>
    </div>
  </div>
));
ActivityCard.displayName = 'ActivityCard';

const DaySection: React.FC<{ day: DayPlan; defaultOpen?: boolean; onShowMap: (query: string) => void }> = React.memo(({ day, defaultOpen = false, onShowMap }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
        aria-expanded={isOpen}
        aria-controls={`day-panel-${day.dayNumber}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold transition-colors" aria-hidden="true">
            <span className="text-xs uppercase tracking-wider opacity-80">Day</span>
            <span className="text-lg leading-none">{day.dayNumber}</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              <span className="sr-only">Day {day.dayNumber}: </span>{day.theme}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{day.activities.length} activities planned</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400 dark:text-slate-500" aria-hidden="true" /> : <ChevronDown className="text-slate-400 dark:text-slate-500" aria-hidden="true" />}
      </button>
      
      {isOpen && (
        <div id={`day-panel-${day.dayNumber}`} className="p-6 pt-2">
          <div className="relative">
            {day.activities.map((activity, idx) => (
              <ActivityCard key={idx} activity={activity} onShowMap={onShowMap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
DaySection.displayName = 'DaySection';

const RecommendationCard: React.FC<{ title: string; description: string; cost?: string; icon: React.ReactNode; onShowMap: (query: string) => void }> = React.memo(({ title, description, cost, icon, onShowMap }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-4 items-start transition-colors group">
    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg shrink-0 transition-colors" aria-hidden="true">
      {icon}
    </div>
    <div className="flex-grow min-w-0">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h4 className="font-semibold text-slate-800 dark:text-white truncate">{title}</h4>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onShowMap(title)}
            className="p-1 text-slate-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="View on Map"
          >
            <MapIcon className="w-3.5 h-3.5" />
          </button>
          {cost && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md whitespace-nowrap transition-colors">
              <span className="sr-only">Estimated Cost: </span>{cost}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{description}</p>
    </div>
  </div>
));
RecommendationCard.displayName = 'RecommendationCard';

export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = React.memo(({ itinerary, onRefine, isRefining }) => {
  const [refineText, setRefineText] = useState('');
  const [activeMapQuery, setActiveMapQuery] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleRefineSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (refineText.trim() && !isRefining) {
      onRefine(refineText);
      setRefineText('');
    }
  }, [refineText, isRefining, onRefine]);

  const handleShowMap = useCallback((query: string) => {
    setActiveMapQuery(query);
  }, []);

  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          itinerary,
          metadata: { 
            clientTimestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }),
      });
      
      if (!response.ok) throw new Error('Failed to save');
      
      const data = await response.json();
      alert(`Trip saved! ID: ${data.id}`);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save trip to Google Cloud.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <div className="pb-24 space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative transition-colors">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{itinerary.tripTitle}</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{itinerary.summary}</p>
            </div>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm disabled:opacity-50"
              onClick={handleSaveTrip}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Trip'}
            </button>
          </div>
        </div>

        <section className="space-y-6" aria-labelledby="recommendations-heading">
          <h3 id="recommendations-heading" className="text-xl font-bold text-slate-800 dark:text-white px-2">Recommendations</h3>
          
          {itinerary.transportation && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Transportation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.transportation.air && (
                  <RecommendationCard title="Air Travel" description={itinerary.transportation.air} icon={<Plane className="w-5 h-5" />} onShowMap={handleShowMap} />
                )}
                {itinerary.transportation.train && (
                  <RecommendationCard title="Train" description={itinerary.transportation.train} icon={<Train className="w-5 h-5" />} onShowMap={handleShowMap} />
                )}
                {itinerary.transportation.bus && (
                  <RecommendationCard title="Bus" description={itinerary.transportation.bus} icon={<Bus className="w-5 h-5" />} onShowMap={handleShowMap} />
                )}
                {itinerary.transportation.car && (
                  <RecommendationCard title="Car / Driving" description={itinerary.transportation.car} icon={<Car className="w-5 h-5" />} onShowMap={handleShowMap} />
                )}
                {itinerary.transportation.local && (
                  <RecommendationCard title="Local Transit" description={itinerary.transportation.local} icon={<MapPin className="w-5 h-5" />} onShowMap={handleShowMap} />
                )}
              </div>
            </div>
          )}

          {itinerary.hotels && itinerary.hotels.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Where to Stay</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.hotels.map((hotel, idx) => (
                  <RecommendationCard key={idx} title={hotel.name} description={hotel.description} cost={hotel.estimatedCost} icon={<Bed className="w-5 h-5" />} onShowMap={handleShowMap} />
                ))}
              </div>
            </div>
          )}

          {itinerary.restaurants && itinerary.restaurants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Where to Eat</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itinerary.restaurants.map((restaurant, idx) => (
                  <RecommendationCard key={idx} title={restaurant.name} description={restaurant.description} cost={restaurant.estimatedCost} icon={<Utensils className="w-5 h-5" />} onShowMap={handleShowMap} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4" aria-labelledby="daily-plan-heading">
          <h3 id="daily-plan-heading" className="text-xl font-bold text-slate-800 dark:text-white px-2 pt-4">Daily Plan</h3>
          {itinerary.days.map((day, idx) => (
            <DaySection key={day.dayNumber} day={day} defaultOpen={idx === 0} onShowMap={handleShowMap} />
          ))}
        </section>
      </div>

      <div className="sticky bottom-0 mt-auto pt-4 pb-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 transition-colors">
        <form onSubmit={handleRefineSubmit} className="relative max-w-3xl mx-auto" aria-label="Refine Itinerary">
          <label htmlFor="refineInput" className="sr-only">Refine your itinerary</label>
          <input
            id="refineInput"
            type="text"
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Want to change something? e.g., 'Make day 2 more relaxing'"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            disabled={isRefining}
          />
          <button
            type="submit"
            disabled={!refineText.trim() || isRefining}
            aria-label="Submit refinement"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {isRefining ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </form>
      </div>

      {/* Floating Map Overlay */}
      {activeMapQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-[80vh] animate-in zoom-in-95 duration-200">
            <MapView 
              query={activeMapQuery} 
              onClose={() => setActiveMapQuery(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
});
ItineraryDisplay.displayName = 'ItineraryDisplay';
