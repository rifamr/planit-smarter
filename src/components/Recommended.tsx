import { motion } from "framer-motion";
import { Heart, Mountain, Sun, Building2 } from "lucide-react";

const interests = [
  { key: "beaches", label: "Beaches", icon: Sun, color: "from-cyan-400 to-blue-400" },
  { key: "mountains", label: "Mountains", icon: Mountain, color: "from-emerald-400 to-green-500" },
  { key: "city", label: "City Adventures", icon: Building2, color: "from-violet-400 to-fuchsia-500" },
];

const mockDestinations: Record<string, { title: string; img: string; tag: string }[]> = {
  beaches: [
    { title: "Bali Escape", img: "https://images.unsplash.com/photo-1516501312919-6ef8febee5f8?w=1200", tag: "Sustainable" },
    { title: "Maldives Bliss", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200", tag: "Eco-Lodge" },
    { title: "Santorini Blue", img: "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?w=1200", tag: "Low-Carbon" },
  ],
  mountains: [
    { title: "Swiss Alps", img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1200", tag: "Rail Trip" },
    { title: "Himalayan Trails", img: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=1200", tag: "Trek" },
    { title: "Patagonia Wild", img: "https://images.unsplash.com/photo-1526483360412-f4dbaf036963?w=1200", tag: "Protected" },
  ],
  city: [
    { title: "Tokyo Neon", img: "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=1200", tag: "Transit Pass" },
    { title: "Paris Romance", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200", tag: "Walkable" },
    { title: "New York Vibes", img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200", tag: "Cycling" },
  ],
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const Recommended = () => {
  const savedInterest = (localStorage.getItem("interest") || "beaches") as keyof typeof mockDestinations;
  const data = mockDestinations[savedInterest] || mockDestinations.beaches;

  return (
    <section id="recommended" className="section-padding container-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recommended for You</h2>
          <div className="flex gap-2">
            {interests.map((i) => (
              <button
                key={i.key}
                onClick={() => localStorage.setItem("interest", i.key)}
                className={`px-4 py-2 rounded-full text-sm bg-gradient-to-r ${i.color} text-white/90 hover:text-white shadow hover:shadow-lg transition-all`}
              >
                <i.icon className="inline mr-2 h-4 w-4" />{i.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((d, idx) => (
            <motion.div
              key={d.title}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="relative overflow-hidden rounded-2xl group hover-lift hover-glow eco-highlight"
            >
              <img src={d.img} alt={d.title} loading="lazy" className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg drop-shadow">{d.title}</p>
                  <span className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full">{d.tag}</span>
                </div>
                <Heart className="text-white/80 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommended;
