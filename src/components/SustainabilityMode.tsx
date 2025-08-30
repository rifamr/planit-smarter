import { useState, useRef, useEffect } from "react";
import { Leaf, TreePine, Recycle, Train, Home, MapPin, TrendingDown, Users, Award, ChevronRight } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

const SustainabilityMode = () => {
  const [activeTab, setActiveTab] = useState("transport");

  const sustainabilityFeatures = [
    {
      id: "transport",
      title: "Eco Transport",
      icon: Train,
      description: "Public transport, cycling, and walking routes",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "accommodation",
      title: "Green Stays",
      icon: Home,
      description: "Certified eco-hotels and local homestays",
      color: "text-blue-600", 
      bgColor: "bg-blue-50"
    },
    {
      id: "activities",
      title: "Local Experiences",
      icon: Users,
      description: "Community-based tourism and cultural immersion",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: "impact",
      title: "Carbon Offset",
      icon: TreePine,
      description: "Track and offset your travel's carbon footprint",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const impactStats = [
    {
      value: "2.3 tons",
      label: "CO₂ Saved",
      description: "Average reduction per sustainable trip",
      icon: TrendingDown,
      color: "text-green-600"
    },
    {
      value: "85%",
      label: "Local Spend",
      description: "Money going directly to communities",
      icon: Users,
      color: "text-blue-600"
    },
    {
      value: "150+",
      label: "Eco Partners",
      description: "Certified sustainable accommodations",
      icon: Award,
      color: "text-purple-600"
    }
  ];

  const ecoTips = [
    {
      tip: "Choose overland travel when possible",
      impact: "Up to 90% less emissions than flying",
      icon: Train
    },
    {
      tip: "Stay longer in fewer places",
      impact: "Reduces transport-related emissions",
      icon: MapPin
    },
    {
      tip: "Support local businesses",
      impact: "Directly benefits communities",
      icon: Users
    },
    {
      tip: "Pack light and reusable items",
      impact: "Minimizes waste and weight",
      icon: Recycle
    }
  ];

  const carbonComparison = {
    traditional: {
      flights: 2.8,
      accommodation: 0.6,
      transport: 0.4,
      activities: 0.2,
      total: 4.0
    },
    sustainable: {
      flights: 1.2,
      accommodation: 0.2,
      transport: 0.1,
      activities: 0.1,
      total: 1.6
    }
  };

  const [barsActive, setBarsActive] = useState(false);
  const { ref: carbonRef, inView: carbonInView } = useInView({ threshold: 0.2, triggerOnce: true });
  useEffect(()=>{ if (carbonInView) setBarsActive(true); }, [carbonInView]);

  const AnimatedCounter: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ end, duration = 1200, prefix = '', suffix = '' }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
      let raf: number;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setVal(Math.floor(p * end));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [end, duration]);
    return <span>{prefix}{val}{suffix}</span>;
  };

  const sectionIds: Record<string, string> = {
    transport: 'eco-transport',
    accommodation: 'green-stays',
    activities: 'local-experiences',
    impact: 'carbon-offset'
  };

  return (
    <section className="section-padding bg-premium">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-secondary/10 text-secondary px-6 py-3 rounded-full mb-6">
            <Leaf className="w-5 h-5" />
            <span className="font-semibold">Sustainability Mode</span>
          </div>
          
          <h2 className="text-responsive-xl font-bold text-foreground mb-6">
            Travel <span className="text-gradient-secondary">Responsibly</span>
          </h2>
          
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
            Make a positive impact while exploring the world. Our AI prioritizes 
            eco-friendly options that protect destinations for future generations.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {sustainabilityFeatures.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => {
                setActiveTab(feature.id);
                const el = document.getElementById(sectionIds[feature.id]);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`feature-card-premium text-left transition-all duration-300 ${
                activeTab === feature.id
                  ? 'ring-2 ring-secondary shadow-lg'
                  : 'hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </button>
          ))}
        </div>

        {/* Carbon Impact Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Carbon Comparison Chart */}
          <div className="feature-card-premium" ref={carbonRef}>
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-green-600" />
              Carbon Footprint Comparison
            </h3>

            <div className="space-y-6">
              {/* Traditional Travel */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-muted-foreground">Traditional Travel</span>
                  <span className="font-bold text-red-600">
                    <AnimatedCounter end={carbonComparison.traditional.total} /> tons CO₂
                  </span>
                </div>

                <div className="space-y-2">
                  {Object.entries(carbonComparison.traditional).slice(0, -1).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-24 capitalize">{key}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: barsActive ? `${(value / 3) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{value}t</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainable Travel */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-muted-foreground">Sustainable Travel</span>
                  <span className="font-bold text-green-600">
                    <AnimatedCounter end={carbonComparison.sustainable.total} /> tons CO₂
                  </span>
                </div>

                <div className="space-y-2">
                  {Object.entries(carbonComparison.sustainable).slice(0, -1).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-24 capitalize">{key}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: barsActive ? `${(value / 3) * 100}%` : '0%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{value}t</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-800">You Save</span>
                  <span className="text-2xl font-bold text-green-600">
                    {(carbonComparison.traditional.total - carbonComparison.sustainable.total).toFixed(1)} tons CO₂
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Equivalent to planting 54 trees 🌱
                </p>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Real Impact Numbers
            </h3>
            
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="feature-card bg-gradient-to-r from-card to-muted/30 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      <AnimatedCounter end={parseInt(stat.value)} suffix={stat.value.replace(/\d+/g, '')} />
                    </div>
                    <div className="font-semibold text-muted-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-secondary to-secondary-light rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Ready to Travel Green?</h4>
              <p className="text-secondary-foreground/90 mb-4">
                Enable Sustainability Mode and start planning your eco-friendly adventure today.
              </p>
              <button
                onClick={() => {
                  const el = document.documentElement;
                  el.classList.add('eco');
                  try { localStorage.setItem('ecoMode', '1'); } catch {}
                  try { (window as any).toast?.success?.('Sustainability Mode enabled'); } catch {}
                  const it = document.getElementById('itinerary-generator');
                  if (it) it.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-white text-secondary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Enable Sustainability Mode
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Eco Tips Grid */}
        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Sustainable Travel Tips
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecoTips.map((tip, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div
                    className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300 animate-zoom-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-4">
                      <tip.icon className="w-6 h-6" />
                    </div>

                    <h4 className="font-semibold text-foreground mb-3">
                      {tip.tip}
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {tip.impact}
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{tip.tip}</DialogTitle>
                    <DialogDescription>{tip.impact}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Practical guidance, examples, and resources to help you apply this tip on your next trip.</p>
                    <ul className="list-disc pl-5">
                      <li>How to plan</li>
                      <li>Recommended tools</li>
                      <li>Common pitfalls</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Partnership Badges */}
        <div className="mt-20 pt-12 border-t border-border/50">
          <div className="text-center mb-8">
            <h4 className="text-lg font-semibold text-muted-foreground">
              Certified by Leading Environmental Organizations
            </h4>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for certification badges */}
            {[
              "🌍 UN Global Compact",
              "🏆 B Corp Certified", 
              "🌱 Green Tourism",
              "♻️ Carbon Neutral",
              "🌿 Sustainable Travel"
            ].map((badge, index) => (
              <div 
                key={index}
                className="text-muted-foreground font-medium px-4 py-2 bg-muted/50 rounded-lg"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
        {/* Deep Sections */}
        <div className="mt-20 space-y-16">
          <div id="eco-transport" className="feature-card-premium">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><Train className="w-5 h-5" /> Eco Transport</h4>
            <p className="text-muted-foreground mb-4">Public transit maps, rail passes, and cycling routes to minimize emissions.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=500&fit=crop" alt="Eco transport" className="rounded-xl w-full h-48 object-cover" />
              <video src="https://videos.pexels.com/video-files/3356921/3356921-uhd_2560_1440_25fps.mp4" className="rounded-xl w-full h-48 object-cover" autoPlay muted loop playsInline></video>
            </div>
          </div>

          <div id="green-stays" className="feature-card-premium">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><Home className="w-5 h-5" /> Green Stays</h4>
            <p className="text-muted-foreground mb-4">Certified eco-hotels and homestays with clear sustainability practices.</p>
            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&h=600&fit=crop" alt="Green stays" className="rounded-xl w-full h-56 object-cover" />
          </div>

          <div id="local-experiences" className="feature-card-premium">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><Users className="w-5 h-5" /> Local Experiences</h4>
            <p className="text-muted-foreground mb-4">Community-based tourism and cultural immersion activities.</p>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop" alt="Local experiences" className="rounded-xl w-full h-56 object-cover" />
          </div>

          <div id="carbon-offset" className="feature-card-premium">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><TreePine className="w-5 h-5" /> Carbon Offset</h4>
            <p className="text-muted-foreground mb-4">Understand and offset your footprint with verified projects.</p>
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=600&fit=crop" alt="Carbon offset" className="rounded-xl w-full h-56 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityMode;
