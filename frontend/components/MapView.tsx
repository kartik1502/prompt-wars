import React from 'react';
import { Map as MapIcon, X } from 'lucide-react';

interface MapViewProps {
  query: string;
  onClose?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ query, onClose }) => {
  // We use the Google Maps Embed API. 
  // In a real app, you would use an API key from process.env.VITE_GOOGLE_MAPS_API_KEY
  // For this prototype, we'll use the public embed URL pattern if possible, 
  // or a fallback if a key is required but missing.
  
  const encodedQuery = encodeURIComponent(query);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${encodedQuery}`;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-brand-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {query}
          </span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>
      <div className="flex-grow relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        {/* If the user hasn't provided an API key, the embed will show an error. 
            In a real prototype, we'd instruct the user to add it. */}
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
        
        {/* Overlay if key is the placeholder */}
        {mapUrl.includes('REPLACE_WITH_YOUR_API_KEY') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50/90 dark:bg-slate-900/90 z-10">
            <MapIcon className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Google Maps Integration</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
              To see real maps, add your Google Maps API Key to the VITE_GOOGLE_MAPS_API_KEY environment variable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
