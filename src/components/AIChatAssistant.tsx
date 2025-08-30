import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const samples = [
  "Plan a budget-friendly trip",
  "Translate this itinerary",
  "Top things to do in Bali",
  "Best time to visit Paris",
  "Visa requirements for Japan",
  "Packing list for Iceland",
];

const cannedResponses: Record<string, string> = {
  budget: "For budget trips: travel off-season, use public transport, book hostels, and prioritize free attractions.",
  translate: "Use the Language Assistance section to translate phrases and itineraries instantly (mock).",
  bali: "Top Bali picks: Uluwatu Temple, Ubud rice terraces, Nusa Penida, and sunrise Mount Batur hike.",
  paris: "Best time for Paris: April-May and Sept-Oct for mild weather and fewer crowds.",
  visa: "Visa info varies by passport. Check your government's travel site and Japan eVisa (where applicable).",
  packing: "Iceland packing: layers, waterproof jacket, thermal base, sturdy boots, power adapter, and swimwear.",
  safety: "General safety: keep valuables secure, use official taxis, and get travel insurance.",
  sim: "Local SIM/eSIM: consider Airalo/Holafly or buy at airport kiosks for data savings.",
  currency: "Currency tips: use cards with no FX fees, withdraw larger amounts fewer times, avoid DCC at terminals.",
};

const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "bot"|"user"; text: string }[]>([
    { role: "bot", text: "Hi! Ask me about budgets, visas, best times, packing, and more (mock)." },
    ...samples.map((s) => ({ role: "bot" as const, text: s }))
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const replyFor = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes('budget')) return cannedResponses.budget;
    if (t.includes('translate')) return cannedResponses.translate;
    if (t.includes('bali')) return cannedResponses.bali;
    if (t.includes('paris') || t.includes('best time')) return cannedResponses.paris;
    if (t.includes('visa')) return cannedResponses.visa;
    if (t.includes('pack') || t.includes('packing') || t.includes('iceland')) return cannedResponses.packing;
    if (t.includes('safety')) return cannedResponses.safety;
    if (t.includes('sim') || t.includes('esim')) return cannedResponses.sim;
    if (t.includes('currency') || t.includes('money')) return cannedResponses.currency;
    return "Here are some suggestions: set your dates, choose budget, enable Eco mode for greener picks, and preview the Live Demo itinerary (mock).";
  };

  const send = (custom?: string) => {
    const content = (custom ?? input).trim();
    if (!content) return;
    setMessages((m)=>[...m, { role: "user", text: content }]);
    setInput("");
    setTyping(true);
    setTimeout(()=>{
      setMessages((m)=>[...m, { role: "bot", text: replyFor(content) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <button onClick={()=>setOpen((v)=>!v)} className="fixed bottom-6 right-4 lg:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-2xl hover:scale-105 transition">
        <MessageSquare className="h-6 w-6 mx-auto" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-4 lg:right-8 z-50 w-[min(22rem,calc(100vw-2rem))] sm:w-96 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 border-b text-sm font-semibold">AI Travel Assistant</div>
            <div className="px-3 py-2 flex flex-wrap gap-2 border-b bg-muted/40">
              {samples.slice(0,4).map((s, i)=> (
                <button key={i} onClick={()=>send(s)} className="text-xs px-2 py-1 rounded-full border border-border hover:bg-muted transition">{s}</button>
              ))}
              <button onClick={()=>send('Visa requirements for Japan')} className="text-xs px-2 py-1 rounded-full border border-border hover:bg-muted transition">Visa for Japan</button>
            </div>
            <div className="h-64 overflow-auto space-y-2 p-3">
              {messages.map((m, i)=> (
                <div key={i} className={`text-sm p-2 rounded-lg max-w-[85%] ${m.role==='bot' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground ml-auto'}`}>{m.text}</div>
              ))}
              {typing && (
                <div className="bg-muted text-foreground p-2 rounded-lg inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 p-3 border-t">
              <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') send(); }} placeholder="Type a message..." className="flex-1 bg-transparent outline-none" />
              <button onClick={()=>send()} className="btn-primary px-4 py-2"><Send className="h-4 w-4"/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
