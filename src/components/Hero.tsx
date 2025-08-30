import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, Search, MapPin, Calendar, DollarSign, Users, Star, Play, Volume2, VolumeX } from "lucide-react";

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    travelers: 2,
    budget: "medium",
    sustainability: false
  });

  const popularDestinations = [
    "Tokyo, Japan", "Paris, France", "New York, USA", "London, UK", 
    "Rome, Italy", "Barcelona, Spain", "Dubai, UAE", "Thailand",
    "Santorini, Greece", "Bali, Indonesia", "Iceland", "Costa Rica"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePlanTrip = () => {
    scrollToSection('itinerary-generator');
  };

  const handleExploreEco = () => {
    scrollToSection('sustainability-mode');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePlanTrip();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setIsVideoLoaded(false)}
          poster="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop"
        >
          <source
            src="https://player.vimeo.com/external/394498002.hd.mp4?s=5dcf97b3d92a40dcf7b1de17212d6c84726e6ca7&profile_id=175"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/33645089/14297758_640_360_24fps.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Fallback image for unsupported browsers or failed video load */}
        {!isVideoLoaded && (
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      {/* Video Controls */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-20 z-30 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <motion.div 
          className="absolute top-20 left-10 text-white/20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 text-white/20"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-32 left-1/4 text-white/20"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full mb-8 hover:bg-white/15 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI-Powered Trip Planning</span>
            <span className="text-white/80">•</span>
            <span className="text-sm text-white/80">Instant & Personalized</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Plan Your Trip
            <br />
            <span className="text-gradient-primary bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Smarter with AI
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Your dream itinerary in seconds. Get personalized travel plans 
            that match your style, budget, and sustainability goals.
          </motion.p>

          {/* Enhanced Search Form */}
          <motion.div 
            variants={formVariants}
            className="max-w-5xl mx-auto mb-12"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Destination */}
                  <div className="lg:col-span-2">
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900"
                        required
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900"
                        min={new Date().toISOString().split('T')[0]}
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900"
                        min={searchForm.checkin || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none text-gray-900"
                      >
                        <option value={1}>1 Traveler</option>
                        <option value={2}>2 Travelers</option>
                        <option value={3}>3 Travelers</option>
                        <option value={4}>4 Travelers</option>
                        <option value="5+">5+ Travelers</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={searchForm.budget}
                        onChange={(e) => setSearchForm({...searchForm, budget: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none text-gray-900"
                      >
                        <option value="budget">Budget ($50-100/day)</option>
                        <option value="medium">Medium ($100-200/day)</option>
                        <option value="luxury">Luxury ($200+/day)</option>
                      </select>
                    </div>
                  </div>

                  {/* Sustainability Toggle */}
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={searchForm.sustainability}
                        onChange={(e) => setSearchForm({...searchForm, sustainability: e.target.checked})}
                        className="w-5 h-5 text-secondary rounded border-gray-300 focus:ring-secondary"
                      />
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium text-gray-700">
                          Eco-Travel Mode
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  type="submit"
                  className="w-full btn-hero text-lg py-4 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Plan my trip"
                >
                  <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                  Plan My Dream Trip
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button 
              onClick={handleExploreEco}
              className="btn-hero-secondary group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Explore Eco-Travel
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('how-it-works')}
              className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch How It Works
            </motion.button>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div 
            variants={itemVariants}
            className="text-white/80"
          >
            <p className="text-sm uppercase tracking-wider mb-6">Trusted by 50,000+ travelers worldwide</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <motion.div 
                className="flex -space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-light to-accent border-2 border-white"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  ></motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
              >
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <span className="font-semibold">4.9/5</span>
                <span className="text-white/60">• 2,847 reviews</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => scrollToSection('how-it-works')}
      >
        <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center cursor-pointer hover:border-white/75 transition-colors">
          <motion.div 
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
