import { MapPin, Brain, Calendar, Download } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Enter Your Details",
      description: "Tell us your budget, destination, and trip duration. Add your travel preferences and interests.",
      color: "text-primary"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI analyzes thousands of travel options and generates a custom plan just for you.",
      color: "text-accent"
    },
    {
      icon: Calendar,
      title: "Personalized Itinerary",
      description: "Get detailed recommendations for activities, accommodations, dining, and sustainable travel options.",
      color: "text-secondary"
    },
    {
      icon: Download,
      title: "Share & Explore",
      description: "Download your itinerary, share with friends, or book directly through our platform.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-24 bg-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Planning your perfect trip has never been easier. Our AI-powered platform 
            creates personalized itineraries in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="feature-card-gradient text-center group animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 mb-6 group-hover:scale-110 transition-transform duration-300 ${step.color}`}>
                <step.icon className="w-8 h-8" />
              </div>
              
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Connecting Lines */}
        <div className="hidden lg:flex justify-center mt-16">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-accent rounded-full animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;