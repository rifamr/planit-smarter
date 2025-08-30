// API Service Layer with Mock Data and Real Integration Points

export interface TripRequest {
  destination: string;
  checkin: string;
  checkout: string;
  travelers: number;
  budget: string;
  sustainability: boolean;
  interests?: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  description: string;
  activities: Activity[];
  meals: Meal[];
  accommodation?: Accommodation;
  transportation?: Transportation;
  budget: DayBudget;
  sustainability_score: number;
  weather?: WeatherInfo;
}

export interface Activity {
  id: string;
  name: string;
  type: 'attraction' | 'experience' | 'tour' | 'outdoor' | 'cultural';
  description: string;
  duration: string;
  price: number;
  location: Location;
  rating: number;
  sustainability_features: string[];
  booking_url?: string;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  cuisine: string;
  price_range: string;
  location: Location;
  description: string;
  sustainability_rating: number;
}

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  google_maps_url?: string;
}

export interface Accommodation {
  name: string;
  type: string;
  rating: number;
  price_per_night: number;
  location: Location;
  amenities: string[];
  sustainability_certifications: string[];
}

export interface Transportation {
  type: 'walking' | 'public_transport' | 'taxi' | 'bike' | 'flight';
  description: string;
  duration: string;
  cost: number;
  carbon_footprint: number;
  sustainability_score: number;
}

export interface DayBudget {
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  total: number;
}

export interface WeatherInfo {
  temperature: {
    high: number;
    low: number;
    unit: 'C' | 'F';
  };
  condition: string;
  precipitation_chance: number;
  humidity: number;
  wind_speed: number;
}

export interface TripItinerary {
  id: string;
  destination: string;
  duration: number;
  total_budget: number;
  sustainability_score: number;
  days: ItineraryDay[];
  summary: {
    highlights: string[];
    total_activities: number;
    carbon_offset_needed: number;
    local_impact_score: number;
  };
  currency: {
    code: string;
    exchange_rate: number;
    last_updated: string;
  };
}

// Mock Data
const MOCK_DESTINATIONS = [
  {
    name: "Tokyo, Japan",
    country: "Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    currency: "JPY",
    popular_activities: ["temples", "sushi", "shopping", "gardens"],
    best_months: ["April", "May", "October", "November"],
    sustainability_features: ["excellent public transport", "waste reduction culture", "local food markets"]
  },
  {
    name: "Paris, France", 
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    currency: "EUR",
    popular_activities: ["museums", "architecture", "cafes", "parks"],
    best_months: ["May", "June", "September", "October"],
    sustainability_features: ["bike sharing", "local markets", "walking districts"]
  },
  {
    name: "Costa Rica",
    country: "Costa Rica",
    coordinates: { lat: 9.7489, lng: -83.7534 },
    currency: "CRC",
    popular_activities: ["wildlife", "hiking", "beaches", "zip-lining"],
    best_months: ["December", "January", "February", "March", "April"],
    sustainability_features: ["eco-lodges", "renewable energy", "conservation programs", "carbon neutral"]
  }
];

// API Configuration
const API_CONFIG = {
  // Replace with your actual API keys
  OPENAI_API_KEY: (import.meta as any).env?.VITE_OPENAI_API_KEY || 'demo-key',
  GOOGLE_TRANSLATE_KEY: (import.meta as any).env?.VITE_GOOGLE_TRANSLATE_KEY || 'demo-key',
  MAPBOX_API_KEY: (import.meta as any).env?.VITE_MAPBOX_API_KEY || 'demo-key',
  WEATHER_API_KEY: (import.meta as any).env?.VITE_WEATHER_API_KEY || 'demo-key',
  EXCHANGE_RATE_KEY: (import.meta as any).env?.VITE_EXCHANGE_RATE_KEY || 'demo-key',
};

// Utility Functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LibreTranslate (no key required)
export const translateLibre = async (text: string, target: string): Promise<string> => {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'auto', target })
    });
    if (res.ok) {
      const data = await res.json();
      return data.translatedText || text;
    }
  } catch (e) {
    console.warn('LibreTranslate failed', e);
  }
  return text;
};

// Simple geocoder for city to coordinates using Nominatim
export const geocodePlace = async (place: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
    const json = await res.json();
    if (Array.isArray(json) && json[0]) {
      return { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
    }
  } catch (e) {
    console.warn('Geocoding failed', e);
  }
  return null;
};

const calculateDuration = (checkin: string, checkout: string): number => {
  const start = new Date(checkin);
  const end = new Date(checkout);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const generateMockItinerary = (request: TripRequest): TripItinerary => {
  const duration = calculateDuration(request.checkin, request.checkout);
  const destination = MOCK_DESTINATIONS.find(d => 
    d.name.toLowerCase().includes(request.destination.toLowerCase()) ||
    d.country.toLowerCase().includes(request.destination.toLowerCase())
  ) || MOCK_DESTINATIONS[0];

  const budgetMultiplier = {
    'budget': 0.7,
    'medium': 1.0,
    'luxury': 1.8
  }[request.budget] || 1.0;

  const baseDayBudget = 150 * budgetMultiplier;
  const sustainabilityBonus = request.sustainability ? 0.2 : 0;

  const days: ItineraryDay[] = Array.from({ length: duration }, (_, index) => {
    const date = new Date(request.checkin);
    date.setDate(date.getDate() + index);
    
    return {
      day: index + 1,
      date: date.toISOString().split('T')[0],
      title: `Day ${index + 1}: ${index === 0 ? 'Arrival & Exploration' : 
                               index === 1 ? 'Cultural Immersion' : 
                               index === duration - 1 ? 'Departure Day' : 
                               `Adventure & Discovery`}`,
      description: `Explore the best of ${destination.name} with curated experiences tailored to your interests.`,
      activities: [
        {
          id: `act-${index}-1`,
          name: destination.popular_activities[index % destination.popular_activities.length],
          type: 'attraction',
          description: `Experience authentic ${destination.popular_activities[index % destination.popular_activities.length]} in ${destination.name}`,
          duration: '2-3 hours',
          price: 25 * budgetMultiplier,
          location: {
            address: `${destination.name} City Center`,
            coordinates: destination.coordinates,
            google_maps_url: `https://maps.google.com/?q=${destination.coordinates.lat},${destination.coordinates.lng}`
          },
          rating: 4.5 + Math.random() * 0.5,
          sustainability_features: destination.sustainability_features.slice(0, 2),
          booking_url: '#'
        },
        {
          id: `act-${index}-2`,
          name: `Local ${destination.popular_activities[(index + 1) % destination.popular_activities.length]} Experience`,
          type: 'cultural',
          description: `Immersive local experience showcasing traditional ${destination.country} culture`,
          duration: '3-4 hours',
          price: 45 * budgetMultiplier,
          location: {
            address: `Historic District, ${destination.name}`,
            coordinates: {
              lat: destination.coordinates.lat + (Math.random() - 0.5) * 0.01,
              lng: destination.coordinates.lng + (Math.random() - 0.5) * 0.01
            }
          },
          rating: 4.7 + Math.random() * 0.3,
          sustainability_features: request.sustainability ? 
            ['supports local community', 'eco-friendly practices'] : [],
          booking_url: '#'
        }
      ],
      meals: [
        {
          type: 'breakfast',
          name: 'Local Café',
          cuisine: `${destination.country} traditional`,
          price_range: '$',
          location: {
            address: 'Near accommodation',
            coordinates: destination.coordinates
          },
          description: 'Start your day with authentic local breakfast',
          sustainability_rating: request.sustainability ? 4.5 : 3.0
        },
        {
          type: 'lunch',
          name: 'Traditional Restaurant',
          cuisine: `${destination.country} cuisine`,
          price_range: '$$',
          location: {
            address: 'City center',
            coordinates: destination.coordinates
          },
          description: 'Savor local flavors and regional specialties',
          sustainability_rating: request.sustainability ? 4.0 : 3.5
        },
        {
          type: 'dinner',
          name: 'Fine Dining Experience',
          cuisine: 'International fusion',
          price_range: request.budget === 'luxury' ? '$$$' : '$$',
          location: {
            address: 'Restaurant district',
            coordinates: destination.coordinates
          },
          description: 'End your day with a memorable culinary experience',
          sustainability_rating: request.sustainability ? 4.5 : 3.0
        }
      ],
      accommodation: index === 0 ? {
        name: request.budget === 'luxury' ? 'Luxury Resort' : 
              request.budget === 'medium' ? 'Boutique Hotel' : 'Eco Hostel',
        type: request.budget === 'luxury' ? 'Resort' : 
              request.budget === 'medium' ? 'Hotel' : 'Hostel',
        rating: request.budget === 'luxury' ? 4.8 : 
                request.budget === 'medium' ? 4.2 : 4.0,
        price_per_night: baseDayBudget * 0.4,
        location: {
          address: `${destination.name} Premium District`,
          coordinates: destination.coordinates
        },
        amenities: request.budget === 'luxury' ? 
          ['spa', 'pool', 'concierge', 'fine dining'] :
          request.budget === 'medium' ? 
          ['wifi', 'breakfast', 'gym', 'restaurant'] :
          ['wifi', 'shared kitchen', 'common areas'],
        sustainability_certifications: request.sustainability ? 
          ['Green Key', 'LEED Certified', 'Local sourcing'] : []
      } : undefined,
      transportation: {
        type: request.sustainability ? 'public_transport' : 'taxi',
        description: request.sustainability ? 
          'Eco-friendly public transport and walking' : 
          'Convenient taxi and ride-sharing',
        duration: '30-45 minutes',
        cost: request.sustainability ? 5 : 15,
        carbon_footprint: request.sustainability ? 0.1 : 0.5,
        sustainability_score: request.sustainability ? 5 : 2
      },
      budget: {
        accommodation: baseDayBudget * 0.4,
        food: baseDayBudget * 0.3,
        activities: baseDayBudget * 0.25,
        transportation: baseDayBudget * 0.05,
        total: baseDayBudget
      },
      sustainability_score: request.sustainability ? 4.5 + Math.random() * 0.5 : 2.5 + Math.random() * 1.0,
      weather: {
        temperature: {
          high: 20 + Math.random() * 15,
          low: 10 + Math.random() * 10,
          unit: 'C'
        },
        condition: ['Sunny', 'Partly Cloudy', 'Clear', 'Light Rain'][Math.floor(Math.random() * 4)],
        precipitation_chance: Math.floor(Math.random() * 30),
        humidity: 40 + Math.random() * 40,
        wind_speed: 5 + Math.random() * 15
      }
    };
  });

  return {
    id: `trip-${Date.now()}`,
    destination: destination.name,
    duration,
    total_budget: baseDayBudget * duration,
    sustainability_score: request.sustainability ? 4.2 + Math.random() * 0.8 : 2.8 + Math.random() * 1.2,
    days,
    summary: {
      highlights: [
        `Authentic ${destination.country} cultural experiences`,
        `${duration} days of curated adventures`,
        request.sustainability ? 'Eco-friendly travel options' : 'Convenient travel arrangements',
        `Local cuisine and dining experiences`,
        `Professional local guides and recommendations`
      ],
      total_activities: days.reduce((acc, day) => acc + day.activities.length, 0),
      carbon_offset_needed: request.sustainability ? duration * 0.5 : duration * 2.5,
      local_impact_score: request.sustainability ? 4.5 : 3.2
    },
    currency: {
      code: destination.currency,
      exchange_rate: 1.0, // Will be updated by currency API
      last_updated: new Date().toISOString()
    }
  };
};

// AI Itinerary API
export const generateItinerary = async (request: TripRequest): Promise<TripItinerary> => {
  console.log('Generating itinerary for:', request);
  
  try {
    // Simulate API delay
    await delay(2000 + Math.random() * 3000);

    // In production, this would call OpenAI API:
    if (API_CONFIG.OPENAI_API_KEY !== 'demo-key') {
      // Real OpenAI API call would go here
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional travel planner. Create detailed day-by-day itineraries in JSON format.'
            },
            {
              role: 'user',
              content: `Create a ${calculateDuration(request.checkin, request.checkout)}-day itinerary for ${request.destination} with budget: ${request.budget}, travelers: ${request.travelers}, sustainability focus: ${request.sustainability}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Parse OpenAI response and convert to our format
        return parseOpenAIResponse(data, request);
      }
    }

    // Fallback to mock data
    return generateMockItinerary(request);
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    // Fallback to mock data on error
    return generateMockItinerary(request);
  }
};

// Translation API
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    if (API_CONFIG.GOOGLE_TRANSLATE_KEY !== 'demo-key') {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_CONFIG.GOOGLE_TRANSLATE_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.translations[0].translatedText;
      }
    }

    // Mock translation
    await delay(500);
    return `[${targetLanguage.toUpperCase()}] ${text}`;
    
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Weather API
export const getWeatherForecast = async (destination: string): Promise<WeatherInfo[]> => {
  try {
    if (API_CONFIG.WEATHER_API_KEY !== 'demo-key') {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`);
      
      if (response.ok) {
        const data = await response.json();
        return data.list.slice(0, 7).map((item: any) => ({
          temperature: {
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            unit: 'C'
          },
          condition: item.weather[0].main,
          precipitation_chance: Math.round((item.pop || 0) * 100),
          humidity: item.main.humidity,
          wind_speed: Math.round(item.wind.speed)
        }));
      }
    }

    // Mock weather data
    await delay(800);
    return Array.from({ length: 7 }, () => ({
      temperature: {
        high: 15 + Math.random() * 20,
        low: 8 + Math.random() * 12,
        unit: 'C' as const
      },
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'][Math.floor(Math.random() * 5)],
      precipitation_chance: Math.floor(Math.random() * 40),
      humidity: 30 + Math.random() * 50,
      wind_speed: 5 + Math.random() * 20
    }));
    
  } catch (error) {
    console.error('Weather API error:', error);
    return [];
  }
};

// Currency API
export const getCurrencyRates = async (baseCurrency: string = 'USD'): Promise<Record<string, number>> => {
  try {
    if (API_CONFIG.EXCHANGE_RATE_KEY !== 'demo-key') {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_CONFIG.EXCHANGE_RATE_KEY}/latest/${baseCurrency}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.conversion_rates;
      }
    }

    // Mock currency rates
    await delay(600);
    return {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      KRW: 1180.0
    };
    
  } catch (error) {
    console.error('Currency API error:', error);
    return { USD: 1.0 };
  }
};

// Featured Destinations API
export const getFeaturedDestinations = async (): Promise<any[]> => {
  try {
    // In production, this might fetch from a CMS or database
    await delay(1000);
    
    return [
      {
        id: 1,
        name: "Santorini",
        country: "Greece",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
        rating: 4.9,
        reviews: 2847,
        category: ["Relaxation", "History"],
        duration: "5-7 days",
        price: 1200,
        description: "Experience breathtaking sunsets and pristine white architecture in this volcanic island paradise.",
        highlights: ["Iconic blue domes", "Wine tasting", "Sunset cruises", "Ancient ruins"],
        sustainable: true
      },
      {
        id: 2,
        name: "Kyoto",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
        rating: 4.8,
        reviews: 3456,
        category: ["History", "Foodie"],
        duration: "4-6 days",
        price: 1500,
        description: "Immerse yourself in traditional Japanese culture with temples, gardens, and authentic cuisine.",
        highlights: ["Golden Pavilion", "Bamboo groves", "Tea ceremonies", "Traditional markets"],
        sustainable: true
      },
      {
        id: 3,
        name: "Costa Rica",
        country: "Central America",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
        rating: 4.7,
        reviews: 1923,
        category: ["Adventure", "Budget"],
        duration: "8-10 days",
        price: 900,
        description: "Discover incredible biodiversity with rainforests, beaches, and wildlife adventures.",
        highlights: ["Zip-lining", "Wildlife spotting", "Volcano hiking", "Beach relaxation"],
        sustainable: true
      }
    ];
    
  } catch (error) {
    console.error('Featured destinations error:', error);
    return [];
  }
};

// Helper function to parse OpenAI response (placeholder)
const parseOpenAIResponse = (response: any, request: TripRequest): TripItinerary => {
  // This would parse the OpenAI response and convert it to our TripItinerary format
  // For now, fallback to mock data
  return generateMockItinerary(request);
};

export default {
  generateItinerary,
  translateText,
  getWeatherForecast,
  getCurrencyRates,
  getFeaturedDestinations
};
