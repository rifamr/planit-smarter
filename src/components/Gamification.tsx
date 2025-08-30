import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Globe, HelpCircle, Trophy } from "lucide-react";

const quiz = {
  question: "Which city pass saves the most on museums?",
  options: ["Paris", "Tokyo", "Vienna", "Zurich"],
  answer: 0,
};

const suggestions = [
  "Bali on a budget",
  "Swiss scenic rail",
  "Paris weekend walking tour",
  "Tokyo food crawl",
  "Athens history hop",
];

const Gamification = () => {
  const [xp, setXp] = useState(60);
  const [choice, setChoice] = useState<number | null>(null);
  const [spun, setSpun] = useState<string | null>(null);

  const top = useMemo(() => [
    { name: "Ava", xp: 92 },
    { name: "Liam", xp: 78 },
    { name: "Maya", xp: 65 },
  ], []);

  const spin = () => {
    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSpun(pick);
  };

  return (
    <section id="gamified" className="section-padding container-padding bg-section">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-3"><HelpCircle className="h-5 w-5"/><h3 className="text-lg font-semibold">Daily Quiz</h3></div>
          <p className="mb-4">{quiz.question}</p>
          <div className="space-y-2">
            {quiz.options.map((o, i) => (
              <button key={o} onClick={() => { setChoice(i); setXp((x)=>x + (i === quiz.answer ? 5 : 0)); }} className={`w-full text-left px-4 py-2 rounded-lg border transition ${choice===i? 'border-primary bg-primary/10' : 'hover:bg-muted'}`}>{o}</button>
            ))}
          </div>
        </div>

        <div className="card-premium p-6 flex flex-col items-center justify-center text-center">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 animate-spin-slow flex items-center justify-center shadow-glow">
            <Globe className="h-16 w-16 text-white drop-shadow" />
          </div>
          <button onClick={spin} className="mt-4 btn-primary">Spin the Globe</button>
          {spun && <p className="mt-2 text-sm text-muted-foreground">Suggestion: {spun}</p>}
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-2 mb-3"><Trophy className="h-5 w-5"/><h3 className="text-lg font-semibold">Top Explorers</h3></div>
          <ul className="space-y-3">
            {top.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm"><span>{t.name}</span><span>{t.xp} XP</span></div>
                  <Progress value={t.xp} className="h-2" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div className="flex justify-between text-sm"><span>You</span><span>{xp} XP</span></div>
            <Progress value={xp} className="h-2" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
