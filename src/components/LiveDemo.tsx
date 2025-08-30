import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Calendar, DollarSign, Leaf, Sparkles, Users, Clock, Star, Download, Share2, Heart, Navigation, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { generateItinerary, type TripRequest, type TripItinerary, getCurrencyRates, getWeatherForecast } from "@/services/api";
import MapView from "@/components/MapView";
import LeafletMap from "@/components/LeafletMap";
import { translateLibre } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const LiveDemo = () => {
  const [formData, setFormData] = useState<TripRequest>({
    destination: "",
    checkin: "",
    checkout: "",
    travelers: 2,
    budget: "medium",
    sustainability: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<TripItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [itineraryText, setItineraryText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [translateLang, setTranslateLang] = useState<string>("es");
  const [barsActive, setBarsActive] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const interestsOptions = ["Food", "Culture", "Nature", "Adventure", "Nightlife", "Relaxation"];

  // Prefill destination from URL query (e.g., ?destination=Tokyo)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get('destination');
    if (dest) {
      setFormData(prev => ({ ...prev, destination: dest }));
    }
  }, []);

  // Listen for hero "Plan My Dream Trip" event: autofill and notify
  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<TripRequest>;
      const req = e.detail;
      if (!req || !req.destination) return;
      setFormData(prev => ({ ...prev, ...req }));
      const el = document.getElementById('itinerary-generator');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast.success('Your itinerary form has been auto-filled!');
    };
    window.addEventListener('ai-plan-trip', handler as EventListener);
    return () => window.removeEventListener('ai-plan-trip', handler as EventListener);
  }, []);

  const generateFromRequest = async (request: TripRequest) => {
    if (!request.destination || !request.checkin || !request.checkout) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const [itinerary, rates, forecast] = await Promise.all([
        generateItinerary(request),
        getCurrencyRates('USD'),
        getWeatherForecast(request.destination)
      ]);

      const merged: TripItinerary = {
        ...itinerary,
        days: itinerary.days.map((d, i) => ({
          ...d,
          weather: forecast[i] ? forecast[i] : d.weather,
        }))
      };
      setGeneratedItinerary(merged);
      setCurrencyRates(rates);

      const text = [
        `Destination: ${merged.destination}`,
        `Duration: ${merged.duration} days, Travelers: ${merged.travelers}`,
        '',
        ...merged.days.map(d => `Day ${d.day} (${d.date}): ${d.title}\n- ${d.description}\n- Activities: ${d.activities.map(a => a.name).join(', ')}`)
      ].join('\n');
      setItineraryText(text);
      setTranslatedText("");
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateFromRequest(formData);
  };

  useEffect(() => {
    if (generatedItinerary) {
      setBarsActive(false);
      const t = setTimeout(() => setBarsActive(true), 50);
      return () => clearTimeout(t);
    }
  }, [generatedItinerary]);

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const downloadItinerary = () => {
    if (!generatedItinerary) return;
    
    const dataStr = JSON.stringify(generatedItinerary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedItinerary.destination.replace(/\s+/g, '-')}-itinerary.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareItinerary = async () => {
    if (!generatedItinerary) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${generatedItinerary.destination} Trip`,
          text: `Check out my ${generatedItinerary.duration}-day itinerary for ${generatedItinerary.destination}!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `My ${generatedItinerary.duration}-day itinerary for ${generatedItinerary.destination} - Generated by PlanIt Smarter AI`;
      navigator.clipboard.writeText(shareText);
      alert('Itinerary link copied to clipboard!');
    }
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

  return (
    <section className="section-padding bg-hero" ref={ref}>
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-responsive-xl font-bold text-foreground mb-6">
              AI Itinerary <span className="text-gradient-primary">Generator</span>
            </h2>
            <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
              Experience the magic of AI-powered trip planning. Enter your preferences 
              and watch as we create your perfect itinerary in seconds.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Enhanced Demo Form */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="feature-card-gradient"
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Plan Your Perfect Trip
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Destination *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Check-in *
                  </label>
                  <input
                    type="date"
                    value={formData.checkin}
                    onChange={(e) => setFormData({...formData, checkin: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Check-out *
                  </label>
                  <input
                    type="date"
                    value={formData.checkout}
                    onChange={(e) => setFormData({...formData, checkout: e.target.value})}
                    min={formData.checkin || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Duration (days)
                </label>
                <select
                  value={Math.max(2, Math.min(14, Math.ceil((new Date(formData.checkout).getTime() - new Date(formData.checkin).getTime())/(1000*60*60*24)) || 2))}
                  onChange={(e) => {
                    const days = Number(e.target.value);
                    if (formData.checkin) {
                      const d = new Date(formData.checkin);
                      d.setDate(d.getDate() + days);
                      const iso = d.toISOString().split('T')[0];
                      setFormData({ ...formData, checkout: iso });
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {[...Array(13)].map((_, i) => (
                    <option key={i+2} value={i+2}>{i+2} days</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Travelers
                  </label>
                  <select
                    value={formData.travelers}
                    onChange={(e) => setFormData({...formData, travelers: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value={1}>1 Traveler</option>
                    <option value={2}>2 Travelers</option>
                    <option value={3}>3 Travelers</option>
                    <option value={4}>4 Travelers</option>
                    <option value="5+">5+ Travelers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Budget Range
                  </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={1}
                      value={{ budget:1, medium:2, luxury:3 }[formData.budget as 'budget'|'medium'|'luxury']}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const map: Record<number,string> = {1:'budget',2:'medium',3:'luxury'};
                        setFormData({ ...formData, budget: map[val] });
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Budget</span><span>Medium</span><span>Luxury</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Interests</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {interestsOptions.map((tag) => {
                    const active = (formData.interests || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const set = new Set(formData.interests || []);
                          if (set.has(tag)) set.delete(tag); else set.add(tag);
                          setFormData({ ...formData, interests: Array.from(set) });
                        }}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${active ? 'bg-primary text-white border-primary' : 'bg-background text-foreground border-border hover:bg-muted'}`}
                        aria-pressed={active}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
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

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isGenerating}
                className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                aria-label="Generate itinerary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My Itinerary
                  </>
                )}
              </motion.button>
            </form>

            {formData.destination && (
              <div className="mt-4">
                <div className="text-sm font-medium text-foreground mb-2">
                  Selected: <span className="text-primary">{formData.destination}</span>
                </div>
                <LeafletMap city={formData.destination} height={140} />
              </div>
            )}

            <div className="mt-4 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary hover:text-accent font-medium">View Sample Itinerary</button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sample Itinerary Preview</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Preview a 3-day city escape with top attractions, dining, and transport tips.</p>
                    <ul className="list-disc pl-5">
                      <li>Day 1: Arrival, city walk, local dinner</li>
                      <li>Day 2: Museums, markets, cultural show</li>
                      <li>Day 3: Nature spot and souvenir shopping</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Enhanced Results */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="feature-card text-center py-16"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Creating Your Perfect Itinerary
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI is analyzing millions of travel data points to craft your personalized experience...
                  </p>
                  <div className="space-y-2">
                    {[
                      "Analyzing destination preferences...",
                      "Finding the best attractions...",
                      "Optimizing your route...",
                      "Adding local insights...",
                      "Finalizing your perfect trip..."
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.5, duration: 0.3 }}
                        className="text-sm text-muted-foreground text-left"
                      >
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : generatedItinerary ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="feature-card"
                >
                  {/* Itinerary Header */}
                  <div className="border-b border-border/50 pb-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                          <Navigation className="w-6 h-6 text-accent" />
                          {generatedItinerary.destination}
                        </h3>
                        <p className="text-muted-foreground">
                          {generatedItinerary.duration} days • {generatedItinerary.travelers} travelers
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          onClick={shareItinerary}
                          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Share2 className="w-5 h-5 text-primary" />
                        </motion.button>
                        
                        <motion.button
                          onClick={downloadItinerary}
                          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="w-5 h-5 text-primary" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Trip Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">
                          ${Math.round(generatedItinerary.total_budget)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Budget</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {(() => {
                            const code = generatedItinerary.currency?.code || 'USD';
                            const rate = currencyRates[code];
                            if (rate && code !== 'USD') {
                              const symbol = code === 'EUR' ? '€' : code === 'JPY' ? '¥' : code + ' ';
                              return <span>{symbol}{Math.round(generatedItinerary.total_budget * rate)}</span>;
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground flex items-center justify-center gap-1">
                          {generatedItinerary.sustainability_score.toFixed(1)}
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                        <div className="text-xs text-muted-foreground">Eco Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">
                          {generatedItinerary.summary.total_activities}
                        </div>
                        <div className="text-xs text-muted-foreground">Activities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">
                          {generatedItinerary.summary.carbon_offset_needed.toFixed(1)}t
                        </div>
                        <div className="text-xs text-muted-foreground">CO₂ Offset</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 border border-border/50 rounded-xl">
                        <h4 className="font-semibold mb-2">Weather</h4>
                        {generatedItinerary.days[0]?.weather ? (
                          <div className="text-sm text-muted-foreground">
                            <div>Today: {generatedItinerary.days[0].weather.condition}</div>
                            <div>Temp: {Math.round(generatedItinerary.days[0].weather.temperature.low)}°C - {Math.round(generatedItinerary.days[0].weather.temperature.high)}°C</div>
                            <div>Precipitation: {generatedItinerary.days[0].weather.precipitation_chance}%</div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Weather data unavailable</div>
                        )}
                      </div>
                      <LeafletMap city={generatedItinerary.destination} height={180} />
                    </div>
                  </div>

                  {/* Day-by-Day Itinerary */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {generatedItinerary.days.map((day, index) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, rotate: 0.25 }}
                        className="border border-border/50 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {day.day}
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-foreground">{day.title}</h4>
                              <p className="text-sm text-muted-foreground">{day.date}</p>
                            </div>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
                            expandedDay === day.day ? 'rotate-180' : ''
                          }`} />
                        </button>

                        <AnimatePresence>
                          {expandedDay === day.day && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-4 pb-4"
                            >
                              <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                  {day.description}
                                </p>

                                {/* Activities */}
                                <div>
                                  <h5 className="font-medium text-foreground mb-2">Activities</h5>
                                  <div className="space-y-2">
                                    {day.activities.map((activity) => (
                                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <h6 className="font-medium text-foreground">{activity.name}</h6>
                                            <div className="flex items-center gap-1">
                                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                              <span className="text-xs text-muted-foreground">
                                                {activity.rating.toFixed(1)}
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            {activity.duration} • ${activity.price}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => toggleFavorite(activity.id)}
                                          className="p-1 rounded transition-colors"
                                        >
                                          <Heart className={`w-4 h-4 ${
                                            favorites.includes(activity.id) 
                                              ? 'text-red-500 fill-current' 
                                              : 'text-muted-foreground'
                                          }`} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Budget Breakdown */}
                                <div>
                                  <h5 className="font-medium text-foreground mb-2">Daily Budget</h5>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Activities:</span>
                                      <span className="font-medium">${Math.round(day.budget.activities)}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 col-span-2">
                                      <div className="bg-primary h-2 rounded-full transition-all duration-700" style={{ width: barsActive ? `${Math.min(100, Math.round((day.budget.activities/day.budget.total)*100))}%` : '0%' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Food:</span>
                                      <span className="font-medium">${Math.round(day.budget.food)}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 col-span-2">
                                      <div className="bg-accent h-2 rounded-full transition-all duration-700" style={{ width: barsActive ? `${Math.min(100, Math.round((day.budget.food/day.budget.total)*100))}%` : '0%' }} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Transport:</span>
                                      <span className="font-medium">${Math.round(day.budget.transportation)}</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 col-span-2">
                                      <div className="bg-secondary h-2 rounded-full transition-all duration-700" style={{ width: barsActive ? `${Math.min(100, Math.round((day.budget.transportation/day.budget.total)*100))}%` : '0%' }} />
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                      <span>Total:</span>
                                      <span>${Math.round(day.budget.total)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Itinerary (Text) + Translation */}
                  <div className="mt-6 p-4 border border-border/50 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <h4 className="font-semibold">Itinerary (Text)</h4>
                      <div className="flex items-center gap-2">
                        <select value={translateLang} onChange={(e)=>setTranslateLang(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
                          {[
                            { code: 'es', label: 'Spanish' },
                            { code: 'fr', label: 'French' },
                            { code: 'de', label: 'German' },
                            { code: 'ja', label: 'Japanese' },
                            { code: 'hi', label: 'Hindi' },
                          ].map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                        </select>
                        <button
                          className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-sm"
                          onClick={async()=>{
                            const res = await translateLibre(itineraryText, translateLang);
                            setTranslatedText(res);
                          }}
                        >Translate</button>
                      </div>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap bg-muted/30 p-3 rounded-lg max-h-60 overflow-auto">{translatedText || itineraryText}</pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
                    <motion.button
                      className="flex-1 btn-outline-hero text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast("Saved to favorites (placeholder)")}
                    >
                      Save Itinerary
                    </motion.button>
                    <motion.button
                      className="flex-1 btn-hero-secondary text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast("Booking flow coming soon")}
                    >
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="feature-card text-center py-16"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Ready to Plan Your Dream Trip?
                  </h3>
                  <p className="text-muted-foreground">
                    Fill out the form to see your AI-generated itinerary appear here with detailed day-by-day plans!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
