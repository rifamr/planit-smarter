import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const VoiceAndGestures = () => {
  const [listening, setListening] = useState(false);
  const waveform = Array.from({ length: 20 }, (_, i) => i);
  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const simIntervalRef = useRef<any>(null);
  const [transcript, setTranscript] = useState("");
  const [simulating, setSimulating] = useState(false);

  const handleVoiceCommand = (text: string) => {
    const m = text.match(/plan (?:my )?trip to ([a-zA-Z\s,]+)/i) || text.match(/go to ([a-zA-Z\s,]+)/i);
    const destination = m?.[1]?.trim();
    if (destination) {
      const today = new Date();
      const checkin = today.toISOString().split('T')[0];
      const out = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      const checkout = out.toISOString().split('T')[0];
      const detail = { destination, checkin, checkout, travelers: 2, budget: 'medium', sustainability: false };
      window.dispatchEvent(new CustomEvent('ai-plan-trip', { detail }));
      toast({ title: 'Voice command', description: `Planning trip to ${destination}` });
    } else if (text) {
      toast({ title: 'Voice transcript', description: text });
    } else {
      toast({ title: 'Voice', description: 'No speech detected' });
    }
  };

  const startListening = () => {
    setTranscript("");
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSimulating(true);
      setListening(true);
      const samples = [
        'Plan my trip to Paris next week',
        'Plan trip to Tokyo',
        'Find eco-friendly hotels in Bali'
      ];
      const chosen = samples[Math.floor(Math.random() * samples.length)];
      const words = chosen.split(' ');
      let i = 0;
      simIntervalRef.current = setInterval(() => {
        setTranscript((prev) => prev + (prev ? ' ' : '') + words[i]);
        i++;
        if (i >= words.length) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
          setSimulating(false);
          setListening(false);
          handleVoiceCommand(chosen);
        }
      }, 200);
      return;
    }

    try {
      const recog = new SR();
      recog.lang = 'en-US';
      recog.interimResults = true;
      recog.onresult = (e: any) => {
        const txt = e.results[0][0].transcript;
        setTranscript(txt);
      };
      recog.onerror = () => { setListening(false); setSimulating(false); };
      recog.onend = () => { setListening(false); handleVoiceCommand(transcript); };
      recognitionRef.current = recog;
      setListening(true);
      recog.start();
    } catch {
      setListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setSimulating(false);
    setListening(false);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        el.animate([{ transform: `translateX(${dx > 0 ? '20px':'-20px'})` }, { transform: 'translateX(0)' }], { duration: 300, easing: 'ease-out' });
      }
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd); };
  }, []);

  return (
    <>
      <div ref={containerRef} className="md:hidden" />
      <button onClick={() => (listening ? stopListening() : startListening())} aria-label="Voice control" className="fixed bottom-24 right-4 lg:right-8 z-[100] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:scale-105 transition">
        <Mic className="h-6 w-6 mx-auto" />
      </button>
      <AnimatePresence>
        {listening && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-40 right-4 lg:right-8 z-[100] bg-background border border-border rounded-xl p-4 shadow-lg w-64">
            <p className="text-sm mb-2">{listening ? 'Listening...' : 'Voice ready'} {simulating && '(Simulating)'}</p>
            <div className="flex items-end gap-1 h-12">
              {waveform.map((i) => (
                <motion.span key={i} className="w-1 bg-primary rounded" animate={{ height: [8, 32, 10] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.03 }} />
              ))}
            </div>
            {transcript && <p className="text-xs mt-2 break-words text-muted-foreground">"{transcript}"</p>}
            <p className="text-[10px] mt-1 text-muted-foreground">Try: "Plan trip to Paris"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAndGestures;
