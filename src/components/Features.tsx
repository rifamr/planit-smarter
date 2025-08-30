import { Users, Leaf, Globe, Zap, Heart, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Personalized Trip Companions",
      description: "Choose from our AI companions: Foodie Guide for culinary adventures, History Expert for cultural insights, and Adventure Buddy for thrilling experiences.",
      gradient: "from-primary to-accent"
    },
    {
      icon: Leaf,
      title: "Sustainability Mode",
      description: "Discover eco-friendly travel options including local homestays, public transport routes, and low-carbon activities that protect our planet.",
      gradient: "from-secondary to-secondary-light"
    },
    {
      icon: Globe,
      title: "Multi-Language Assistance",
      description: "Get itineraries and essential phrases in 10+ languages. Break language barriers and connect with locals wherever you travel.",
      gradient: "from-accent to-primary"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Receive instant notifications about weather changes, local events, and transportation updates to keep your trip running smoothly.",
      gradient: "from-primary-light to-secondary"
    },
    {
      icon: Heart,
      title: "Social Travel",
      description: "Connect with fellow travelers, share experiences, and discover hidden gems recommended by our community of explorers.",
      gradient: "from-secondary to-accent"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Travel with confidence using our safety alerts, emergency contacts, and secure payment processing for all your bookings.",
      gradient: "from-accent-light to-primary-dark"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Powerful <span className="text-gradient-primary">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of travel planning with our cutting-edge AI features 
            designed to make every journey unforgettable and sustainable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <button className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-2 group/btn">
                  Learn more 
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 text-center animate-scale-in">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to revolutionize your travel planning?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered smarter, more sustainable ways to explore the world.
          </p>
          <button className="btn-hero">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;