import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const samples = [
  "Plan a budget-friendly trip",
  "Translate this itinerary",
  "Top things to do in Bali",
];

const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "bot"|"user"; text: string }[]>([
    { role: "bot", text: "Hi! I can help with planning, budgets, and tips (mock)." },
    ...samples.map((s) => ({ role: "bot" as const, text: s }))
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m)=>[...m, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(()=>{ setMessages((m)=>[...m, { role: "bot", text: "Here are some mock suggestions ✨" }]); setTyping(false); }, 900);
  };

  return (
    <>
      <button onClick={()=>setOpen((v)=>!v)} className="fixed bottom-6 right-4 lg:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-2xl hover:scale-105 transition">
        <MessageSquare className="h-6 w-6 mx-auto" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-24 right-4 lg:right-8 z-50 w-80 bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-3 border-b text-sm font-semibold">AI Travel Assistant</div>
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
              <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent outline-none" />
              <button onClick={send} className="btn-primary px-4 py-2"><Send className="h-4 w-4"/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
