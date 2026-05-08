export interface Activity {
  time: string;
  duration: string;
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Recommendation {
  name: string;
  description: string;
  estimatedCost: string;
}

export interface TransportationOptions {
  air?: string;
  train?: string;
  bus?: string;
  car?: string;
  local?: string;
}

export interface Itinerary {
  tripTitle: string;
  summary: string;
  transportation: TransportationOptions;
  hotels: Recommendation[];
  restaurants: Recommendation[];
  days: DayPlan[];
}

export interface TripRequest {
  origin: string;
  destination: string;
  duration: number;
  travelers: number;
  budgetMin?: number | '';
  budgetMax?: number | '';
  interests: string[];
  constraints: string;
}
