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

// Local fallback dictionary-based translator for predefined languages
const LOCAL_FALLBACK_TRANSLATE = (text: string, target: string): string => {
  if (!text || !target || target === 'en') return text;

  const simplify = (s: string) => s.normalize('NFC');
  const t = simplify(text);

  // Pattern-based translations for common itinerary phrases
  const patterns: Record<string, Record<string, (m: RegExpMatchArray) => string>> = {
    es: {
      // Explore the best of {X} with curated experiences tailored to your interests.
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `Explora lo mejor de ${m[1]} con experiencias seleccionadas a tus intereses.`,
      '^Immersive local experience in (.+)$':
        (m) => `Experiencia local inmersiva en ${m[1]}`,
      '^Local (.+) Experience$':
        (m) => `Experiencia local de ${m[1]}`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `Día ${m[1]}: Llegada y Exploración`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `Día ${m[1]}: Inmersión Cultural`,
      '^Day (\\d+): Departure Day$':
        (m) => `Día ${m[1]}: Día de Salida`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `Día ${m[1]}: Aventura y Descubrimiento`,
    },
    fr: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `Découvrez le meilleur de ${m[1]} avec des expériences sélectionnées selon vos intérêts.`,
      '^Immersive local experience in (.+)$':
        (m) => `Expérience locale immersive à ${m[1]}`,
      '^Local (.+) Experience$':
        (m) => `Expérience locale de ${m[1]}`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `Jour ${m[1]} : Arrivée et Exploration`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `Jour ${m[1]} : Immersion Culturelle`,
      '^Day (\\d+): Departure Day$':
        (m) => `Jour ${m[1]} : Jour du Départ`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `Jour ${m[1]} : Aventure et Découverte`,
    },
    de: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `Entdecken Sie das Beste von ${m[1]} mit kuratierten Erlebnissen, die auf Ihre Interessen zugeschnitten sind.`,
      '^Immersive local experience in (.+)$':
        (m) => `Eintauchendes lokales Erlebnis in ${m[1]}`,
      '^Local (.+) Experience$':
        (m) => `Lokales ${m[1]}-Erlebnis`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `Tag ${m[1]}: Ankunft & Erkundung`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `Tag ${m[1]}: Kulturelles Eintauchen`,
      '^Day (\\d+): Departure Day$':
        (m) => `Tag ${m[1]}: Abreisetag`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `Tag ${m[1]}: Abenteuer & Entdeckung`,
    },
    ja: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `${m[1]}の魅力を、あなたの興味に合わせた体験で満喫しましょう。`,
      '^Immersive local experience in (.+)$':
        (m) => `${m[1]}での没入型ローカル体験`,
      '^Local (.+) Experience$':
        (m) => `ローカル${m[1]}体験`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `${m[1]}日目：到着と観光`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `${m[1]}日目：文化体験`,
      '^Day (\\d+): Departure Day$':
        (m) => `${m[1]}日目：出発日`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `${m[1]}日目：冒険と発見`,
    },
    hi: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `${m[1]} के सर्वोत्तम स्थानों का अनुभव करें, आपकी रुचि के अनुसार चुने गए अनुभवों के साथ।`,
      '^Immersive local experience in (.+)$':
        (m) => `${m[1]} में गहन स्थानीय अनुभव`,
      '^Local (.+) Experience$':
        (m) => `स्थानीय ${m[1]} अनुभव`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `दिन ${m[1]}: आगमन और खोज`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `दिन ${m[1]}: सांस्कृतिक अनुभव`,
      '^Day (\\d+): Departure Day$':
        (m) => `दिन ${m[1]}: प्रस्थान दिवस`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `दिन ${m[1]}: रोमांच और खोज`,
    },
    it: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `Scopri il meglio di ${m[1]} con esperienze curate su misura per i tuoi interessi.`,
      '^Immersive local experience in (.+)$':
        (m) => `Esperienza locale immersiva a ${m[1]}`,
      '^Local (.+) Experience$':
        (m) => `Esperienza locale di ${m[1]}`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `Giorno ${m[1]}: Arrivo ed Esplorazione`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `Giorno ${m[1]}: Immersione Culturale`,
      '^Day (\\d+): Departure Day$':
        (m) => `Giorno ${m[1]}: Giorno della Partenza`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `Giorno ${m[1]}: Avventura e Scoperta`,
    },
    pt: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `Explore o melhor de ${m[1]} com experiências selecionadas de acordo com seus interesses.`,
      '^Immersive local experience in (.+)$':
        (m) => `Experiência local imersiva em ${m[1]}`,
      '^Local (.+) Experience$':
        (m) => `Experiência local de ${m[1]}`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `Dia ${m[1]}: Chegada e Exploração`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `Dia ${m[1]}: Imersão Cultural`,
      '^Day (\\d+): Departure Day$':
        (m) => `Dia ${m[1]}: Dia da Partida`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `Dia ${m[1]}: Aventura e Descoberta`,
    },
    zh: {
      '^Explore the best of (.+) with curated experiences tailored to your interests\.$':
        (m) => `通过符合您兴趣的精选体验，探索${m[1]}的精华。`,
      '^Immersive local experience in (.+)$':
        (m) => `${m[1]}的沉浸式本地体验`,
      '^Local (.+) Experience$':
        (m) => `本地${m[1]}体验`,
      '^Day (\\d+): Arrival & Exploration$':
        (m) => `第${m[1]}天：抵达与探索`,
      '^Day (\\d+): Cultural Immersion$':
        (m) => `第${m[1]}天：文化体验`,
      '^Day (\\d+): Departure Day$':
        (m) => `第${m[1]}天：离开日`,
      '^Day (\\d+): Adventure & Discovery$':
        (m) => `第${m[1]}天：冒险与发现`,
    },
  };

  const lang = (target || '').toLowerCase();
  const rules = patterns[lang as keyof typeof patterns];
  if (rules) {
    for (const [pattern, fn] of Object.entries(rules)) {
      const re = new RegExp(pattern);
      const match = t.match(re);
      if (match) return fn(match);
    }
  }

  // Fallback simple dictionary replacement for common words
  const dicts: Record<string, Record<string, string>> = {
    es: {
      Day: 'Día', Arrival: 'Llegada', Exploration: 'Exploración', Cultural: 'Cultural', Immersion: 'Inmersión',
      Departure: 'Salida', Adventure: 'Aventura', Discovery: 'Descubrimiento', Local: 'Local', Experience: 'Experiencia',
      Explore: 'Explora', best: 'mejor', with: 'con', curated: 'seleccionadas', experiences: 'experiencias',
      tailored: 'a medida', interests: 'intereses', Authentic: 'Auténtico', in: 'en',
    },
    fr: {
      Day: 'Jour', Arrival: 'Arrivée', Exploration: 'Exploration', Cultural: 'Culturelle', Immersion: 'Immersion',
      Departure: 'Départ', Adventure: 'Aventure', Discovery: 'Découverte', Local: 'Locale', Experience: 'Expérience',
      Explore: 'Découvrez', best: 'meilleur', with: 'avec', curated: 'sélectionnées', experiences: 'expériences',
      tailored: 'adaptées', interests: 'intérêts', Authentic: 'Authentique', in: 'à',
    },
    de: {
      Day: 'Tag', Arrival: 'Ankunft', Exploration: 'Erkundung', Cultural: 'Kulturelle', Immersion: 'Eintauchen',
      Departure: 'Abreise', Adventure: 'Abenteuer', Discovery: 'Entdeckung', Local: 'Lokales', Experience: 'Erlebnis',
      Explore: 'Entdecken', best: 'Beste', with: 'mit', curated: 'kuratierte', experiences: 'Erlebnisse',
      tailored: 'zugeschnitten', interests: 'Interessen', Authentic: 'Authentisch', in: 'in',
    },
    ja: {
      Day: '日目', Arrival: '到着', Exploration: '観光', Cultural: '文化', Immersion: '体験',
      Departure: '出発', Adventure: '冒険', Discovery: '発見', Local: 'ローカル', Experience: '体験',
      Explore: '満喫', best: '魅力', with: 'で', curated: '厳選', experiences: '体験', tailored: '合わせた', interests: '興味', Authentic: '本格的', in: 'で',
    },
    hi: {
      Day: 'दिन', Arrival: 'आगमन', Exploration: 'खोज', Cultural: 'सांस्कृतिक', Immersion: 'अनुभव',
      Departure: 'प्रस्थान', Adventure: 'रोमांच', Discovery: 'खोज', Local: 'स्थानीय', Experience: 'अनुभव',
      Explore: 'अनुभव करें', best: 'सर्वोत्तम', with: 'साथ', curated: 'चुने हुए', experiences: 'अनुभव', tailored: 'अनुकूलित', interests: 'रुचि', Authentic: 'प्रामाणिक', in: 'में',
    },
    it: {
      Day: 'Giorno', Arrival: 'Arrivo', Exploration: 'Esplorazione', Cultural: 'Culturale', Immersion: 'Immersione',
      Departure: 'Partenza', Adventure: 'Avventura', Discovery: 'Scoperta', Local: 'Locale', Experience: 'Esperienza',
      Explore: 'Scopri', best: 'meglio', with: 'con', curated: 'selezionate', experiences: 'esperienze', tailored: 'su misura', interests: 'interessi', Authentic: 'Autentico', in: 'a',
    },
    pt: {
      Day: 'Dia', Arrival: 'Chegada', Exploration: 'Exploração', Cultural: 'Cultural', Immersion: 'Imersão',
      Departure: 'Partida', Adventure: 'Aventura', Discovery: 'Descoberta', Local: 'Local', Experience: 'Experiência',
      Explore: 'Explore', best: 'melhor', with: 'com', curated: 'selecionadas', experiences: 'experiências', tailored: 'personalizadas', interests: 'interesses', Authentic: 'Autêntico', in: 'em',
    },
    zh: {
      Day: '第', Arrival: '抵达', Exploration: '探索', Cultural: '文化', Immersion: '沉浸',
      Departure: '离开', Adventure: '冒险', Discovery: '发现', Local: '本地', Experience: '体验',
      Explore: '探索', best: '精华', with: '通过', curated: '精选', experiences: '体验', tailored: '符合', interests: '兴趣', Authentic: '正宗', in: '在',
    },
  };
  const d = dicts[lang as keyof typeof dicts];
  if (!d) return text;
  let out = t;
  for (const [en, tr] of Object.entries(d)) {
    const re = new RegExp(`\\b${en}\\b`, 'g');
    out = out.replace(re, tr);
  }
  return out;
};

// LibreTranslate (no key required)
export const translateLibre = async (text: string, target: string): Promise<string> => {
  const payload = { q: text, source: 'auto', target, format: 'text' } as const;
  const endpoints = ['https://libretranslate.de/translate', 'https://libretranslate.com/translate'];
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.translatedText) return data.translatedText;
      }
    } catch (e) {
      console.warn('LibreTranslate failed', url, e);
    }
  }
  // Fallback to predefined/local translation rules
  return LOCAL_FALLBACK_TRANSLATE(text, target);
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
  const duration = calculateDuration(request.checkin, request.checkout) || 3;
  const matched = MOCK_DESTINATIONS.find(d =>
    d.name.toLowerCase().includes(request.destination.toLowerCase()) ||
    d.country.toLowerCase().includes(request.destination.toLowerCase())
  ) || null;

  const displayName = request.destination && request.destination.trim().length > 0
    ? request.destination.trim()
    : (matched ? matched.name : 'Custom Destination');

  const base = matched || {
    name: displayName,
    country: displayName,
    coordinates: { lat: 0, lng: 0 },
    currency: 'USD',
    popular_activities: ['sightseeing', 'local cuisine', 'museum', 'park'],
    best_months: [],
    sustainability_features: []
  };

  const budgetMultiplier = {
    'budget': 0.7,
    'medium': 1.0,
    'luxury': 1.8
  }[request.budget] || 1.0;

  const baseDayBudget = 150 * budgetMultiplier;

  const days: ItineraryDay[] = Array.from({ length: duration }, (_, index) => {
    const date = new Date(request.checkin || new Date());
    date.setDate(date.getDate() + index);

    return {
      day: index + 1,
      date: date.toISOString().split('T')[0],
      title: `Day ${index + 1}: ${index === 0 ? 'Arrival & Exploration' :
                               index === 1 ? 'Cultural Immersion' :
                               index === duration - 1 ? 'Departure Day' :
                               'Adventure & Discovery'}`,
      description: `Explore the best of ${displayName} with curated experiences tailored to your interests.`,
      activities: [
        {
          id: `act-${index}-1`,
          name: base.popular_activities[index % base.popular_activities.length],
          type: 'attraction',
          description: `Experience authentic ${base.popular_activities[index % base.popular_activities.length]} in ${displayName}`,
          duration: '2-3 hours',
          price: 25 * budgetMultiplier,
          location: {
            address: `${displayName} City Center`,
            coordinates: base.coordinates,
            google_maps_url: `https://maps.google.com/?q=${base.coordinates.lat},${base.coordinates.lng}`
          },
          rating: 4.5 + Math.random() * 0.5,
          sustainability_features: base.sustainability_features.slice(0, 2),
          booking_url: '#'
        },
        {
          id: `act-${index}-2`,
          name: `Local ${base.popular_activities[(index + 1) % base.popular_activities.length]} Experience`,
          type: 'cultural',
          description: `Immersive local experience in ${displayName}`,
          duration: '3-4 hours',
          price: 45 * budgetMultiplier,
          location: {
            address: `Historic District, ${displayName}`,
            coordinates: {
              lat: base.coordinates.lat + (Math.random() - 0.5) * 0.01,
              lng: base.coordinates.lng + (Math.random() - 0.5) * 0.01
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
          cuisine: `${displayName} traditional`,
          price_range: '$',
          location: {
            address: 'Near accommodation',
            coordinates: base.coordinates
          },
          description: 'Start your day with authentic local breakfast',
          sustainability_rating: request.sustainability ? 4.5 : 3.0
        },
        {
          type: 'lunch',
          name: 'Traditional Restaurant',
          cuisine: `${displayName} cuisine`,
          price_range: '$$',
          location: {
            address: 'City center',
            coordinates: base.coordinates
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
            coordinates: base.coordinates
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
          address: `${displayName} Premium District`,
          coordinates: base.coordinates
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
    destination: displayName,
    duration,
    total_budget: baseDayBudget * duration,
    sustainability_score: request.sustainability ? 4.2 + Math.random() * 0.8 : 2.8 + Math.random() * 1.2,
    days,
    summary: {
      highlights: [
        `Authentic ${displayName} cultural experiences`,
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
      code: base.currency,
      exchange_rate: 1.0,
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
