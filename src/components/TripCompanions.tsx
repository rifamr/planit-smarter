import { useEffect, useMemo, useState } from "react";
import { Utensils, BookOpen, Mountain, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type PersonaKey = "foodie" | "history" | "adventure";

const personas: Record<PersonaKey, { title: string; icon: any; blurb: string; tips: string[] }> = {
  foodie: {
    title: "Foodie Guide",
    icon: Utensils,
    blurb: "Discover authentic eats, street food trails, markets, and chef-led tastings.",
    tips: ["Book market tours", "Try regional staples", "Look for farm-to-table"],
  },
  history: {
    title: "History Expert",
    icon: BookOpen,
    blurb: "Uncover stories behind landmarks, museums, and heritage walks.",
    tips: ["Time-slot tickets", "Local museum passes", "Guided walking tours"],
  },
  adventure: {
    title: "Adventure Buddy",
    icon: Mountain,
    blurb: "Hike, kayak, and chase sunrises with safe, eco-conscious operators.",
    tips: ["Leave-no-trace", "Local guides", "Rent gear sustainably"],
  },
};

const recommendPersona = (interests: string[]): PersonaKey => {
  const s = interests.map((i) => i.toLowerCase());
  if (s.some((t) => /food|cuisine|eat|restaurant/.test(t))) return "foodie";
  if (s.some((t) => /history|culture|museum|heritage/.test(t))) return "history";
  if (s.some((t) => /adventure|hike|nature|outdoor/.test(t))) return "adventure";
  return "adventure";
};

const TripCompanions = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [selected, setSelected] = useState<PersonaKey | null>(null);

  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ interests?: string[] }>;
      if (e.detail?.interests) setInterests(e.detail.interests);
    };
    window.addEventListener("itinerary-generated", handler as EventListener);
    return () => window.removeEventListener("itinerary-generated", handler as EventListener);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("tripCompanion") as PersonaKey | null;
    if (saved && personas[saved]) setSelected(saved);
  }, []);

  const suggested = useMemo(() => recommendPersona(interests), [interests]);

  const choose = (key: PersonaKey) => {
    localStorage.setItem("tripCompanion", key);
    setSelected(key);
    toast.success(`${personas[key].title} selected`);
  };

  return (
    <section className="section-padding bg-section">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Personalized Trip Companions</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold">Travel with a Smart Companion</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Choose a companion tailored to your interests. Suggested: <span className="font-medium">{personas[suggested].title}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(personas) as PersonaKey[]).map((key) => {
            const p = personas[key];
            const ActiveIcon = p.icon;
            const active = selected === key;
            return (
              <motion.div key={key} whileHover={{ y: -4 }} className={`feature-card-premium p-5 ${active ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="text-sm text-muted-foreground">{p.blurb}</p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground list-disc ml-5 mt-2 space-y-1">
                  {p.tips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => choose(key)} className="btn-primary text-sm">{active ? 'Selected' : 'Choose Companion'}</button>
                  {active && <span className="inline-flex items-center gap-1 text-green-600 text-sm"><Check className="w-4 h-4"/> Active</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TripCompanions;
