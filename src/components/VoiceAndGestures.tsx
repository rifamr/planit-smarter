import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VoiceAndGestures = () => {
  const [listening, setListening] = useState(false);
  const waveform = Array.from({ length: 20 }, (_, i) => i);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <button onClick={() => setListening((v) => !v)} aria-label="Voice control" className="fixed bottom-24 right-4 lg:right-8 z-[100] w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl hover:scale-105 transition">
        <Mic className="h-6 w-6 mx-auto" />
      </button>
      <AnimatePresence>
        {listening && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-40 right-4 lg:right-8 z-[100] bg-background border border-border rounded-xl p-4 shadow-lg w-64">
            <p className="text-sm mb-2">Listening... (Mock Feature)</p>
            <div className="flex items-end gap-1 h-12">
              {waveform.map((i) => (
                <motion.span key={i} className="w-1 bg-primary rounded" animate={{ height: [8, 32, 10] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.03 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAndGestures;
