import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Nomad",
      location: "San Francisco, CA",
      rating: 5,
      text: "PlanIt Smarter transformed how I travel! The AI understood my love for sustainable adventures and created the most incredible eco-friendly itinerary for Costa Rica. Every recommendation was spot-on!",
      avatar: "🌟"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Family Traveler",
      location: "Austin, TX",
      rating: 5,
      text: "Planning a family trip to Japan seemed overwhelming until I found this platform. The AI created a perfect balance of cultural experiences and kid-friendly activities. Our best vacation ever!",
      avatar: "👨‍👩‍👧‍👦"
    },
    {
      name: "Elena Volkov",
      role: "Adventure Photographer",
      location: "Berlin, Germany", 
      rating: 5,
      text: "The Adventure Buddy companion is genius! It found hidden photography spots in Iceland that I never would have discovered. The sustainability mode aligned perfectly with my values too.",
      avatar: "📸"
    },
    {
      name: "David Kim",
      role: "Business Executive",
      location: "Seoul, South Korea",
      rating: 5,
      text: "Efficiency meets wanderlust! The multi-language support saved me hours of research for my European business trip. The local insights were incredibly valuable.",
      avatar: "💼"
    },
    {
      name: "Maya Patel",
      role: "Solo Traveler",
      location: "Mumbai, India",
      rating: 5,
      text: "As a solo female traveler, the safety features and local community connections gave me confidence to explore places I'd never dared to visit before. Absolutely revolutionary!",
      avatar: "🎒"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 bg-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by <span className="text-gradient-primary">Travelers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of happy travelers who have transformed their journeys 
            with our AI-powered trip planning platform.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <div className="feature-card-gradient text-center animate-scale-in">
            <div className="mb-8">
              <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
              <p className="text-xl md:text-2xl text-foreground leading-relaxed italic">
                "{testimonials[currentIndex].text}"
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-2xl">
                {testimonials[currentIndex].avatar}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-foreground text-lg">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-primary font-medium">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-border hover:bg-primary/50'
              }`}
            />
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { number: "50K+", label: "Happy Travelers" },
            { number: "180+", label: "Countries Covered" },
            { number: "4.9★", label: "Average Rating" },
            { number: "95%", label: "Would Recommend" }
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

export default Testimonials;