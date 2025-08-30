import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Leaf, Search, MapPin, Calendar, DollarSign, Users, Star, ChevronLeft, ChevronRight, Play } from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    travelers: 2,
    budget: "medium"
  });

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop",
      description: "Discover white-washed villages and stunning sunsets",
      category: "Romantic"
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop",
      description: "Immerse in ancient temples and serene gardens",
      category: "Cultural"
    },
    {
      id: 3,
      name: "Banff, Canada",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
      description: "Experience pristine wilderness and mountain adventures",
      category: "Adventure"
    },
    {
      id: 4,
      name: "Maldives",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
      description: "Relax in overwater villas and crystal-clear lagoons",
      category: "Tropical"
    },
    {
      id: 5,
      name: "Iceland",
      image: "https://images.unsplash.com/photo-1551436555-9b88c151f10c?w=1920&h=1080&fit=crop",
      description: "Witness Northern Lights and volcanic landscapes",
      category: "Natural Wonders"
    }
  ];

  const popularDestinations = [
    "Tokyo, Japan", "Paris, France", "New York, USA", "London, UK", 
    "Rome, Italy", "Barcelona, Spain", "Dubai, UAE", "Thailand"
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, destinations.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % destinations.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + destinations.length) % destinations.length);
    setIsAutoPlaying(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchForm);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {destinations.map((destination, index) => (
          <div
            key={destination.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
          </div>
        ))}
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <div className="absolute top-20 left-10 text-white/20 animate-float">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 text-white/20 animate-float-delayed">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 text-white/20 animate-float" style={{animationDelay: '4s'}}>
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Current Destination Badge */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full mb-8">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{destinations[currentSlide].name}</span>
            <span className="text-white/80">•</span>
            <span className="text-sm text-white/80">{destinations[currentSlide].category}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Your Dream Trip,
            <br />
            <span className="text-gradient-primary bg-white bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            {destinations[currentSlide].description}. Get personalized itineraries 
            that match your style, budget, and dreams.
          </p>

          {/* Search Form Overlay */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Destination */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Where to?
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        list="destinations"
                        placeholder="Search destinations..."
                        value={searchForm.destination}
                        onChange={(e) => setSearchForm({...searchForm, destination: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                      <datalist id="destinations">
                        {popularDestinations.map((dest, index) => (
                          <option key={index} value={dest} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Check-in */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={searchForm.checkin}
                        onChange={(e) => setSearchForm({...searchForm, checkin: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Check-out */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={searchForm.checkout}
                        onChange={(e) => setSearchForm({...searchForm, checkout: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travelers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={searchForm.travelers}
                        onChange={(e) => setSearchForm({...searchForm, travelers: Number(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                      >
                        <option value={1}>1 Traveler</option>
                        <option value={2}>2 Travelers</option>
                        <option value={3}>3 Travelers</option>
                        <option value={4}>4 Travelers</option>
                        <option value="5+">5+ Travelers</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Budget & Sustainability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={searchForm.budget}
                        onChange={(e) => setSearchForm({...searchForm, budget: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                      >
                        <option value="budget">Budget ($50-100/day)</option>
                        <option value="medium">Medium ($100-200/day)</option>
                        <option value="luxury">Luxury ($200+/day)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-secondary rounded border-gray-300 focus:ring-secondary"
                      />
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-gray-700">
                          Enable Sustainability Mode
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full btn-hero text-lg py-4"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Plan My Dream Trip
                  <ArrowRight className="w-6 h-6 ml-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up mb-16">
            <button className="btn-hero-secondary group">
              <Play className="w-5 h-5 mr-2" />
              Watch How It Works
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="text-white/80">
            <p className="text-sm uppercase tracking-wider mb-6">Trusted by 50,000+ travelers worldwide</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-accent border-2 border-white animate-pulse-slow"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse-slow" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
                <span className="text-white/60">• 2,847 reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
