import { GoogleGenAI, Type, Schema } from '@google/genai';
import { TripRequest, Itinerary } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const activitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    time: { type: Type.STRING, description: "Time of activity, e.g., '09:00 AM' or 'Morning'" },
    duration: { type: Type.STRING, description: "Estimated time required to complete the activity, e.g., '2 hours', '45 mins'" },
    title: { type: Type.STRING, description: "Short title of the activity" },
    description: { type: Type.STRING, description: "Detailed description of what to do" },
    location: { type: Type.STRING, description: "Specific location or area" },
    estimatedCost: { type: Type.STRING, description: "Estimated cost, e.g., '₹1500', 'Free', 'Varies'" }
  },
  required: ["time", "duration", "title", "description", "location", "estimatedCost"]
};

const dayPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER, description: "Day number, starting from 1" },
    theme: { type: Type.STRING, description: "Overall theme for the day, e.g., 'Historical Exploration'" },
    activities: {
      type: Type.ARRAY,
      items: activitySchema,
      description: "List of activities for the day in chronological order"
    }
  },
  required: ["dayNumber", "theme", "activities"]
};

const recommendationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Name of the hotel or restaurant" },
    description: { type: Type.STRING, description: "Why it is recommended and what to expect" },
    estimatedCost: { type: Type.STRING, description: "Estimated cost per night or per meal in INR" }
  },
  required: ["name", "description", "estimatedCost"]
};

const transportationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    air: { type: Type.STRING, description: "Flight recommendations, routes, or tips (if applicable)" },
    train: { type: Type.STRING, description: "Train routes, passes, or tips (if applicable)" },
    bus: { type: Type.STRING, description: "Bus routes or tips (if applicable)" },
    car: { type: Type.STRING, description: "Driving routes, car rental tips, or road trip info (if applicable)" },
    local: { type: Type.STRING, description: "Local transit (subway, taxi, walking) tips" }
  }
};

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING, description: "A catchy title for the trip" },
    summary: { type: Type.STRING, description: "A brief 1-2 sentence summary of the overall trip experience" },
    transportation: {
      ...transportationSchema,
      description: "Detailed transportation recommendations broken down by mode."
    },
    hotels: {
      type: Type.ARRAY,
      items: recommendationSchema,
      description: "Top 2-3 hotel or accommodation recommendations"
    },
    restaurants: {
      type: Type.ARRAY,
      items: recommendationSchema,
      description: "Top 3-4 restaurant or dining recommendations"
    },
    days: {
      type: Type.ARRAY,
      items: dayPlanSchema,
      description: "The day-by-day itinerary"
    }
  },
  required: ["tripTitle", "summary", "transportation", "hotels", "restaurants", "days"]
};

export async function generateItinerary(
  request: TripRequest,
  currentItinerary?: Itinerary,
  tweakRequest?: string
): Promise<Itinerary> {
  let prompt = "";

  if (currentItinerary && tweakRequest) {
    prompt = `You are an expert travel planner. I have an existing itinerary that needs modification based on a user request.\n\n`;
    prompt += `CURRENT ITINERARY:\n${JSON.stringify(currentItinerary, null, 2)}\n\n`;
    prompt += `USER MODIFICATION REQUEST:\n"${tweakRequest}"\n\n`;
    prompt += `Please provide the FULL updated itinerary incorporating these changes. Ensure the output strictly adheres to the required JSON schema. Keep the parts of the itinerary that were not asked to be changed intact as much as possible, while ensuring the overall plan still makes logical sense.`;
  } else {
    prompt = `You are an expert travel planner. Create a detailed, realistic, and engaging itinerary based on the following request.\n\n`;
    prompt += `Origin: ${request.origin}\n`;
    prompt += `Destination: ${request.destination}\n`;
    prompt += `Duration: ${request.duration} days\n`;
    prompt += `Number of Travelers: ${request.travelers}\n`;
    
    if (request.budgetMin !== '' && request.budgetMax !== '') {
      prompt += `Budget Range: ₹${request.budgetMin} to ₹${request.budgetMax} total for all travelers\n`;
    } else {
      prompt += `Budget Range: Flexible / Not specified\n`;
    }
    
    prompt += `Interests & Vibes: ${request.interests && request.interests.length > 0 ? request.interests.join(', ') : 'General sightseeing'}\n`;
    prompt += `Constraints/Requirements: ${request.constraints || 'None'}\n\n`;
    prompt += `Provide a comprehensive day-by-day plan strictly adhering to the requested JSON schema. Ensure activities are logically ordered by time and location proximity where possible. Also provide recommendations for transportation (air, train, bus, car, local), hotels, and restaurants suitable for ${request.travelers} traveler(s). Use INR (₹) for all cost estimations.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: itinerarySchema,
        temperature: 0.7,
        tools: [
          {
            googleSearch: {}
          }
        ]
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Received empty response from the AI model.");
    }

    const itinerary: Itinerary = JSON.parse(jsonStr);
    return itinerary;
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    throw new Error(error.message || "Failed to generate itinerary. Please try again.");
  }
}
