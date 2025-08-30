import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stops = [
  { city: "Lisbon", desc: "Sunny trams and pasteis de nata", img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1200" },
  { city: "Zurich", desc: "Mountains and crystal lakes", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200" },
  { city: "Vienna", desc: "Coffee houses and classic music", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200" },
  { city: "Athens", desc: "Acropolis sunsets", img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1200" },
];

const TravelTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            },
          }
        );
      });

      gsap.to(".path-line", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="travel-timeline" className="section-padding container-padding bg-premium relative overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <h2 className="text-3xl font-bold mb-10">Your Travel Story</h2>

        <div className="relative">
          <svg className="absolute left-6 top-0 h-full w-2" viewBox="0 0 10 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <line x1="5" y1="0" x2="5" y2="1000" stroke="url(#glow)" strokeWidth="6" strokeLinecap="round" strokeDasharray="1000" className="path-line" />
          </svg>

          <div className="space-y-10">
            {stops.map((s, i) => (
              <div key={s.city} className="story-item pl-16 relative">
                <motion.div className="absolute left-2 top-2 h-6 w-6 rounded-full bg-primary shadow-[0_0_10px_#60a5fa] flex items-center justify-center text-white">
                  <MapPin className="h-4 w-4" />
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center card-premium p-4">
                  <img src={s.img} alt={s.city} loading="lazy" className="w-full h-32 md:h-40 object-cover rounded-xl" />
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold">{s.city}</h3>
                    <p className="text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelTimeline;
