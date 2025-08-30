import { useState } from "react";
import { MapPin, Calendar, DollarSign, Leaf, Sparkles } from "lucide-react";

const LiveDemo = () => {
  const [formData, setFormData] = useState({
    destination: "",
    budget: 2500,
    duration: "7",
    sustainability: false
  });
  
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const sampleItinerary = [
    {
      day: "Day 1",
      title: "Arrival & City Center",
      activities: ["Check into eco-friendly hotel", "Walking tour of historic district", "Local organic dinner"],
      sustainability: "🌱 Carbon-neutral transport used"
    },
    {
      day: "Day 2", 
      title: "Cultural Immersion",
      activities: ["Visit local markets", "Cooking class with locals", "Traditional art workshop"],
      sustainability: "🌱 Supporting local communities"
    },
    {
      day: "Day 3",
      title: "Nature Adventure",
      activities: ["Guided nature hike", "Wildlife conservation center", "Sunset photography"],
      sustainability: "🌱 Conservation fee included"
    }
  ];

  return (
    <section className="py-24 bg-hero">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Try Our <span className="text-gradient-primary">Live Demo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the magic of AI-powered trip planning. Enter your preferences 
            and watch as we create your perfect itinerary in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Demo Form */}
          <div className="feature-card-gradient animate-slide-up">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Plan Your Trip
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Destination
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  placeholder="e.g., Tokyo, Japan"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Budget: ${formData.budget}
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>$500</span>
                  <span>$10,000+</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="3">3 days</option>
                  <option value="7">1 week</option>
                  <option value="14">2 weeks</option>
                  <option value="21">3 weeks</option>
                  <option value="30">1 month</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sustainability"
                  checked={formData.sustainability}
                  onChange={(e) => setFormData({...formData, sustainability: e.target.checked})}
                  className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
                />
                <label htmlFor="sustainability" className="flex items-center gap-2 text-foreground cursor-pointer">
                  <Leaf className="w-4 h-4 text-secondary" />
                  Enable Sustainability Mode
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full btn-hero"
                disabled={!formData.destination}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Itinerary
              </button>
            </form>
          </div>

          {/* Results */}
          <div className={`transition-all duration-500 ${showResult ? 'animate-slide-up opacity-100' : 'opacity-50'}`}>
            <div className="feature-card">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-accent" />
                Your AI-Generated Itinerary
              </h3>
              
              {showResult ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4">
                    <h4 className="font-semibold text-foreground">
                      {formData.destination} • {formData.duration} days • ${formData.budget} budget
                    </h4>
                    {formData.sustainability && (
                      <p className="text-secondary text-sm mt-1">🌱 Eco-friendly options prioritized</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {sampleItinerary.map((day, index) => (
                      <div 
                        key={index}
                        className="border border-border/50 rounded-xl p-4 hover:shadow-md transition-shadow"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-semibold text-foreground">{day.day}</h5>
                            <p className="text-sm text-muted-foreground">{day.title}</p>
                          </div>
                        </div>
                        
                        <ul className="space-y-1 mb-3">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {activity}
                            </li>
                          ))}
                        </ul>
                        
                        {formData.sustainability && (
                          <p className="text-xs text-secondary bg-secondary/10 rounded-lg px-3 py-1">
                            {day.sustainability}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 btn-outline-hero">
                      Save Itinerary
                    </button>
                    <button className="flex-1 btn-hero-secondary">
                      Book Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill out the form to see your AI-generated itinerary appear here!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;