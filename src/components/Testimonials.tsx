import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "@/components/ui/LazyImage";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight, Star, Quote, Play, Pause, MapPin } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  country: string;
  flag: string;
  rating: number;
  text: string;
  avatar: string;
  trip: string;
  image: string;
  verified: boolean;
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Digital Nomad",
      location: "San Francisco",
      country: "USA",
      flag: "🇺🇸",
      rating: 5,
      text: "PlanIt Smarter transformed how I travel! The AI understood my love for sustainable adventures and created the most incredible eco-friendly itinerary for Costa Rica. Every recommendation was spot-on, and I discovered hidden gems I never would have found on my own.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      trip: "Costa Rica Adventure",
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop",
      verified: true
    },
    {
      id: 2,
      name: "Marcus Rodriguez", 
      role: "Family Traveler",
      location: "Austin",
      country: "USA",
      flag: "🇺🇸",
      rating: 5,
      text: "Planning a family trip to Japan seemed overwhelming until I found this platform. The AI created a perfect balance of cultural experiences and kid-friendly activities. Our best vacation ever! The language assistance feature was incredibly helpful too.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      trip: "Japan Family Adventure",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
      verified: true
    },
    {
      id: 3,
      name: "Elena Volkov",
      role: "Adventure Photographer",
      location: "Berlin",
      country: "Germany", 
      flag: "🇩🇪",
      rating: 5,
      text: "The Adventure Buddy companion is genius! It found hidden photography spots in Iceland that I never would have discovered. The sustainability mode aligned perfectly with my values, and the carbon offset tracking made me feel great about my impact.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      trip: "Iceland Photography Tour",
      image: "https://images.unsplash.com/photo-1551436555-9b88c151f10c?w=600&h=400&fit=crop",
      verified: true
    },
    {
      id: 4,
      name: "David Kim",
      role: "Business Executive",
      location: "Seoul",
      country: "South Korea",
      flag: "🇰🇷",
      rating: 5,
      text: "Efficiency meets wanderlust! The multi-language support saved me hours of research for my European business trip. The local insights were incredibly valuable, and the real-time updates kept me informed throughout my journey.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      trip: "European Business Tour",
      image: "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=600&h=400&fit=crop",
      verified: true
    },
    {
      id: 5,
      name: "Maya Patel",
      role: "Solo Traveler",
      location: "Mumbai",
      country: "India",
      flag: "🇮🇳",
      rating: 5,
      text: "As a solo female traveler, the safety features and local community connections gave me confidence to explore places I'd never dared to visit before. The AI recommendations were thoughtful and culturally sensitive. Absolutely revolutionary!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      trip: "Southeast Asia Solo Journey",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      verified: true
    },
    {
      id: 6,
      name: "Alessandro Rossi",
      role: "Food & Travel Blogger",
      location: "Rome",
      country: "Italy",
      flag: "🇮🇹",
      rating: 5,
      text: "The Foodie Guide AI companion understands cuisine better than most humans! It curated an incredible culinary journey through Vietnam, from street food to high-end restaurants. My followers can't stop asking about my secret sauce.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      trip: "Vietnam Culinary Adventure",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
      verified: true
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !inView) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, inView, testimonials.length]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-section" ref={ref}>
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-responsive-xl font-bold text-foreground mb-6">
              Loved by <span className="text-gradient-primary">Travelers</span> Worldwide
            </h2>
            <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
              Join thousands of happy travelers who have transformed their journeys 
              with our AI-powered trip planning platform.
            </p>
          </motion.div>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="relative h-[600px] lg:h-[500px] overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 }
                }}
                className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-0"
              >
                {/* Image Side */}
                <div className="relative overflow-hidden">
                  <LazyImage
                    src={currentTestimonial.image}
                    alt={currentTestimonial.trip}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    fallback="/placeholder.svg"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Trip Badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold text-foreground">{currentTestimonial.trip}</h4>
                          <p className="text-sm text-muted-foreground">
                            Planned with PlanIt Smarter AI
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="bg-card p-8 lg:p-12 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Quote className="w-12 h-12 text-primary/30 mb-6" />
                    
                    <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic mb-8">
                      "{currentTestimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <LazyImage
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                        loading="lazy"
                        fallback="/placeholder.svg"
                        sizes="64px"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground text-lg">
                            {currentTestimonial.name}
                          </h4>
                          {currentTestimonial.verified && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-primary font-medium">
                          {currentTestimonial.role}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-lg">{currentTestimonial.flag}</span>
                          <span>{currentTestimonial.location}, {currentTestimonial.country}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:-left-16">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary shadow-lg transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </motion.button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:-right-16">
            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary shadow-lg transition-all duration-300 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Auto-play Control */}
          <div className="absolute top-4 right-4">
            <motion.button
              onClick={toggleAutoPlay}
              className="w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center gap-4 overflow-x-auto pb-4 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative overflow-hidden rounded-xl transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-primary scale-105' 
                  : 'hover:scale-102 opacity-70 hover:opacity-100'
              }`}
              whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LazyImage
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 object-cover"
                loading="lazy"
                fallback="/placeholder.svg"
                sizes="64px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-1 left-1 right-1 text-center">
                <p className="text-white text-xs font-medium truncate">
                  {testimonial.name.split(' ')[0]}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "50K+", label: "Happy Travelers", icon: "👥" },
            { number: "180+", label: "Countries Covered", icon: "🌍" },
            { number: "4.9★", label: "Average Rating", icon: "⭐" },
            { number: "95%", label: "Would Recommend", icon: "💯" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-2 group-hover:animate-bounce">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                {stat.number}
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

export default Testimonials;
