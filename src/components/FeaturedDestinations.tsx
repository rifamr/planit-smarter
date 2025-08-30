import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Star, Heart, Clock, Camera, Utensils, Mountain, Users, Filter, Loader2 } from "lucide-react";
import { getFeaturedDestinations } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

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
        // Fallback to mock data if API fails
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

  const AnimatedNumber: React.FC<{ value: string; suffix?: string }> = ({ value, suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      const num = parseInt(value);
      if (isNaN(num)) return;
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - startTime) / duration);
        setDisplay(Math.floor(p * num));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, [value]);
    return <span>{display}{suffix}</span>;
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              variants={itemVariants}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.id}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="feature-card h-96 flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading destinations...</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDestinations.map((destination, index) => (
              <Dialog key={destination.id}>
                <DialogTrigger asChild>
                  <motion.div
                    variants={itemVariants}
                    className={`destination-card group cursor-pointer will-change-transform ${destination.sustainable ? 'ring-0 group-hover:ring-2 group-hover:ring-green-300' : ''}`}
                    whileHover={{ scale: 1.02, y: -8 }}
                    transition={{ duration: 0.3 }}
                    onMouseMove={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      const r = el.getBoundingClientRect();
                      const x = e.clientX - r.left;
                      const y = e.clientY - r.top;
                      const rotY = ((x - r.width / 2) / (r.width / 2)) * 6;
                      const rotX = (-(y - r.height / 2) / (r.height / 2)) * 6;
                      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = '';
                    }}
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
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(destination.id);
                        }}
                        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            favorites.includes(destination.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-white'
                          }`}
                        />
                      </motion.button>
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
                    <motion.button
                      className="flex-1 btn-primary text-sm"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95, y: -2 }}
                      onClick={() => {
                        const today = new Date();
                        const toISO = (d: Date) => d.toISOString().split('T')[0];
                        const checkin = toISO(today);
                        const out = new Date(today);
                        out.setDate(out.getDate() + 3);
                        const checkout = toISO(out);
                        const detail = {
                          destination: `${destination.name}, ${destination.country}`,
                          checkin,
                          checkout,
                          travelers: 2,
                          budget: 'medium',
                          sustainability: destination.sustainable || false,
                          interests: [...new Set([...(destination.category||[]), ...(destination.highlights||[])])].slice(0,5)
                        } as any;
                        window.dispatchEvent(new CustomEvent('ai-plan-trip', { detail }));
                        const it = document.getElementById('itinerary-generator');
                        if (it) it.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      aria-label={`Plan trip to ${destination.name}`}
                    >
                      Plan Trip
                    </motion.button>
                    <motion.button 
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {destination.name} <span className="text-muted-foreground text-sm">{destination.country}</span>
                    </DialogTitle>
                    <DialogDescription>
                      Explore highlights, sample photos, and trip details. Booking coming soon.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <img src={destination.image} alt={`${destination.name} preview`} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
                      <img src={`${destination.image}&sat=0&auto=format&fit=crop`} alt={`${destination.name} view 2`} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
                      <img src={`${destination.image}&blur=0&auto=format&fit=crop`} alt={`${destination.name} view 3`} className="w-full h-40 object-cover rounded-xl" loading="lazy" />
                    </div>
                    <p className="text-sm text-muted-foreground">{destination.description}</p>
                    <div className="space-y-2">
                      {destination.highlights.map((h, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <span className="text-sm text-foreground">{h}</span>
                          <button
                            className="btn-outline-hero text-xs"
                            onClick={() => {
                              const today = new Date();
                              const toISO = (d: Date) => d.toISOString().split('T')[0];
                              const checkin = toISO(today);
                              const out = new Date(today);
                              out.setDate(out.getDate() + 4);
                              const checkout = toISO(out);
                              const detail: any = {
                                destination: `${destination.name}, ${destination.country}`,
                                checkin,
                                checkout,
                                travelers: 2,
                                budget: 'medium',
                                sustainability: destination.sustainable || false,
                                interests: [h, ...(destination.category||[])].slice(0,5)
                              };
                              window.dispatchEvent(new CustomEvent('ai-plan-trip', { detail }));
                              const it = document.getElementById('itinerary-generator');
                              if (it) it.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            aria-label={`Plan trip for ${destination.name} - ${h}`}
                          >
                            Plan Trip
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.button
            className="btn-outline-hero"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setDestinations(prev => [
                ...prev,
                ...mockDestinations.map(d => ({ ...d, id: d.id + "-more-" + Math.random().toString(36).slice(2,6) }))
              ]);
              toast.success('Loaded more destinations');
            }}
          >
            <Filter className="w-5 h-5 mr-2" />
            Discover More Destinations
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-border/50"
        >
          {[
            { number: "180", suffix: "+", label: "Destinations" },
            { number: "95", suffix: "%", label: "Satisfaction" },
            { number: "50000", suffix: "+", label: "Travelers" },
            { number: "24", suffix: "/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2 group-hover:animate-pulse">
                <AnimatedNumber value={stat.number} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
