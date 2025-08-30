import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Star, Heart, Clock, Camera, Utensils, Mountain, Users, Filter, Loader2 } from "lucide-react";
import { getFeaturedDestinations } from "@/services/api";

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  reviews: number;
  category: string[];
  duration: string;
  price: number;
  description: string;
  highlights: string[];
  sustainable: boolean;
}

const FeaturedDestinations = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Load destinations from API
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedDestinations();
        setDestinations(data);
      } catch (error) {
        console.error('Failed to load destinations:', error);
        // Fallback to original mock data if API fails
        setDestinations(mockDestinations);
      } finally {
        setIsLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const categories = [
    { id: "All", label: "All Destinations", icon: MapPin },
    { id: "Adventure", label: "Adventure", icon: Mountain },
    { id: "Foodie", label: "Foodie", icon: Utensils },
    { id: "Relaxation", label: "Relaxation", icon: Heart },
    { id: "History", label: "History & Culture", icon: Camera },
    { id: "Budget", label: "Budget-Friendly", icon: Users }
  ];

  const mockDestinations: Destination[] = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
    },
    {
      id: "4",
      name: "Tuscany",
      country: "Italy",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop",
      rating: 4.9,
      reviews: 2156,
      category: ["Foodie", "Relaxation"],
      duration: "6-8 days",
      price: 1800,
      description: "Savor world-class wines, artisanal cuisine, and rolling hills dotted with medieval towns.",
      highlights: ["Wine tours", "Cooking classes", "Art galleries", "Countryside drives"],
      sustainable: false
    },
    {
      id: "5",
      name: "Iceland",
      country: "Nordic",
      image: "https://images.unsplash.com/photo-1551436555-9b88c151f10c?w=800&h=600&fit=crop",
      rating: 4.8,
      reviews: 1678,
      category: ["Adventure", "History"],
      duration: "7-9 days",
      price: 2200,
      description: "Witness the Northern Lights, geysers, and glaciers in this land of fire and ice.",
      highlights: ["Northern Lights", "Blue Lagoon", "Glacier hiking", "Geothermal springs"],
      sustainable: true
    },
    {
      id: "6",
      name: "Bali",
      country: "Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
      rating: 4.6,
      reviews: 4123,
      category: ["Relaxation", "Budget", "Foodie"],
      duration: "5-7 days",
      price: 700,
      description: "Find your zen in tropical paradise with temples, beaches, and spiritual experiences.",
      highlights: ["Temple visits", "Yoga retreats", "Rice terraces", "Traditional spas"],
      sustainable: true
    }
  ];

  const filteredDestinations = activeFilter === "All" 
    ? destinations 
    : destinations.filter(dest => dest.category.includes(activeFilter));

  const toggleFavorite = (destinationId: string) => {
    setFavorites(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="section-padding bg-section" ref={ref}>
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-responsive-xl font-bold text-foreground mb-6">
              Featured <span className="text-gradient-primary">Destinations</span>
            </h2>
            <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
              Discover handpicked destinations that offer unforgettable experiences,
              from sustainable adventures to cultural immersions.
            </p>
          </motion.div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-primary text-white shadow-lg transform scale-105'
                  : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.id}</span>
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <div
              key={destination.id}
              className="destination-card animate-zoom-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {destination.sustainable && (
                        <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                          🌱 Eco-Friendly
                        </span>
                      )}
                      {destination.category.slice(0, 2).map((cat) => (
                        <span 
                          key={cat}
                          className="bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(destination.id);
                      }}
                      className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(destination.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm opacity-90">{destination.country}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{destination.rating}</span>
                        </div>
                        <span className="text-sm opacity-75">({destination.reviews})</span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm opacity-75">from</div>
                        <div className="text-xl font-bold">${destination.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 bg-card">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {destination.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {destination.duration}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.slice(0, 3).map((highlight, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                    {destination.highlights.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{destination.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary text-sm">
                    Plan Trip
                  </button>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-outline-hero">
            <Filter className="w-5 h-5 mr-2" />
            Discover More Destinations
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-border/50">
          {[
            { number: "180+", label: "Destinations" },
            { number: "95%", label: "Satisfaction" },
            { number: "50K+", label: "Travelers" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
