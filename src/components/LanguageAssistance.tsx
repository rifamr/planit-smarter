import { useState, useEffect, useRef } from "react";
import { Globe, Volume2, BookOpen, MessageCircle, Users, Play, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { translateLibre } from "@/services/api";

const LanguageAssistance = () => {
  const [activeLanguage, setActiveLanguage] = useState("spanish");
  const [isPlaying, setIsPlaying] = useState(false);

  // Voice Translation state
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [inputSpeech, setInputSpeech] = useState("");
  const [translatedSpeech, setTranslatedSpeech] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);

  // Chat Assistant state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Local Connect state
  const [connectOpen, setConnectOpen] = useState(false);

  const languages = [
    {
      id: "spanish",
      name: "Spanish",
      flag: "🇪🇸",
      speakers: "500M",
      difficulty: "Easy",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      id: "french",
      name: "French", 
      flag: "🇫🇷",
      speakers: "280M",
      difficulty: "Medium",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "japanese",
      name: "Japanese",
      flag: "🇯🇵", 
      speakers: "125M",
      difficulty: "Hard",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      id: "italian",
      name: "Italian",
      flag: "🇮🇹",
      speakers: "65M", 
      difficulty: "Easy",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: "mandarin",
      name: "Mandarin",
      flag: "🇨🇳",
      speakers: "918M",
      difficulty: "Hard", 
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      id: "portuguese",
      name: "Portuguese",
      flag: "🇧🇷",
      speakers: "260M",
      difficulty: "Medium",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    }
  ];

  const travelPhrases = {
    spanish: [
      { phrase: "¿Dónde está el baño?", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "¿Cuánto cuesta esto?", english: "How much does this cost?", category: "Shopping" },
      { phrase: "¿Puede ayudarme?", english: "Can you help me?", category: "Help" },
      { phrase: "Me gustaría reservar una mesa", english: "I'd like to book a table", category: "Dining" },
      { phrase: "¿Cómo llego a...?", english: "How do I get to...?", category: "Directions" }
    ],
    french: [
      { phrase: "Où sont les toilettes?", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "Combien ça coûte?", english: "How much does this cost?", category: "Shopping" },
      { phrase: "Pouvez-vous m'aider?", english: "Can you help me?", category: "Help" },
      { phrase: "Je voudrais réserver une table", english: "I'd like to book a table", category: "Dining" },
      { phrase: "Comment aller à...?", english: "How do I get to...?", category: "Directions" }
    ],
    japanese: [
      { phrase: "トイレはどこですか？", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "これはいくらですか？", english: "How much does this cost?", category: "Shopping" },
      { phrase: "手伝ってもらえますか？", english: "Can you help me?", category: "Help" },
      { phrase: "テーブルを予約したいです", english: "I'd like to book a table", category: "Dining" },
      { phrase: "...への行き方を教えてください", english: "How do I get to...?", category: "Directions" }
    ],
    italian: [
      { phrase: "Dov'è il bagno?", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "Quanto costa?", english: "How much does this cost?", category: "Shopping" },
      { phrase: "Può aiutarmi?", english: "Can you help me?", category: "Help" },
      { phrase: "Vorrei prenotare un tavolo", english: "I'd like to book a table", category: "Dining" },
      { phrase: "Come arrivo a...?", english: "How do I get to...?", category: "Directions" }
    ],
    mandarin: [
      { phrase: "厕所在哪里？", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "这个多少钱？", english: "How much does this cost?", category: "Shopping" },
      { phrase: "你能帮我吗？", english: "Can you help me?", category: "Help" },
      { phrase: "我想预订一张桌子", english: "I'd like to book a table", category: "Dining" },
      { phrase: "怎么去...？", english: "How do I get to...?", category: "Directions" }
    ],
    portuguese: [
      { phrase: "Onde fica o banheiro?", english: "Where is the bathroom?", category: "Essential" },
      { phrase: "Quanto custa isso?", english: "How much does this cost?", category: "Shopping" },
      { phrase: "Você pode me ajudar?", english: "Can you help me?", category: "Help" },
      { phrase: "Gostaria de reservar uma mesa", english: "I'd like to book a table", category: "Dining" },
      { phrase: "Como chego a...?", english: "How do I get to...?", category: "Directions" }
    ]
  };

  const quickPrompts = [
    { q: "How do I say 'hello' in Japanese?", a: "In Japanese: こんにちは (Konnichiwa)." },
    { q: "How to order vegetarian food in French?", a: "Say: \"Je voudrais un plat végétarien, s'il vous plaît.\"" },
    { q: "Common tipping etiquette in Japan?", a: "Tipping isn't customary in Japan and can be considered rude in many cases." },
    { q: "How to ask for the bill in Spanish?", a: "Ask: \"La cuenta, por favor.\"" },
    { q: "Polite greeting in Italian?", a: "Use \"Buongiorno\" during the day and \"Buonasera\" in the evening." }
  ];

  const features = [
    {
      icon: Volume2,
      title: "Voice Translation",
      description: "Real-time speech translation in 40+ languages",
      color: "text-blue-500"
    },
    {
      icon: BookOpen,
      title: "Cultural Guide",
      description: "Learn local customs and etiquette before you go",
      color: "text-green-500"
    },
    {
      icon: MessageCircle,
      title: "Chat Assistant",
      description: "24/7 multilingual support from AI travel companion",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Local Connect",
      description: "Connect with verified local guides and translators",
      color: "text-orange-500"
    }
  ];

  const culturalTips = [
    {
      country: "Japan",
      flag: "🇯🇵",
      tips: [
        "Bow when greeting people",
        "Remove shoes when entering homes",
        "Don't tip - it's not customary",
        "Be quiet on public transport"
      ]
    },
    {
      country: "France", 
      flag: "🇫��",
      tips: [
        "Always greet with 'Bonjour'",
        "Dress elegantly when dining out",
        "Keep hands visible at the table",
        "Say 'Au revoir' when leaving shops"
      ]
    },
    {
      country: "Spain",
      flag: "🇪🇸", 
      tips: [
        "Dinner is typically after 9 PM",
        "Afternoon siesta is still common",
        "Greet with two cheek kisses",
        "Lunch is the main meal of the day"
      ]
    }
  ];

  const playPhrase = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const startListening = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error('Speech Recognition not supported on this device');
      return;
    }
    const recog = new SR();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = async (e: any) => {
      const text = e.results[0][0].transcript;
      setInputSpeech(text);
      if (targetLang) {
        try {
          const out = await translateLibre(text, targetLang);
          setTranslatedSpeech(out);
        } catch {}
      }
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
    setListening(true);
    recog.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setListening(false);
  };

  const speak = (text: string, lang: string) => {
    const synth: any = (window as any).speechSynthesis;
    if (!synth) {
      toast.error('Speech Synthesis not supported');
      return;
    }
    const utter = new SpeechSynthesisUtterance(text || '');
    utter.lang = lang || 'en-US';
    synth.cancel();
    synth.speak(utter);
  };

  const sendChat = async () => {
    const content = chatInput.trim();
    if (!content) return;
    setMessages(prev => [...prev, { role: 'user', text: content }]);
    setChatInput("");
    const reply = `Here are some tips for: ${content}. Consider learning basic greetings and carry an offline phrasebook.`;
    setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', text: reply }]), 300);
  };

  return (
    <section className="section-padding bg-section-alt">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-full mb-6">
            <Globe className="w-5 h-5" />
            <span className="font-semibold">Language Assistance</span>
          </div>
          
          <h2 className="text-responsive-xl font-bold text-foreground mb-6">
            Break Language <span className="text-gradient-ocean">Barriers</span>
          </h2>
          
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto">
            Communicate confidently anywhere in the world with our AI-powered language tools 
            and cultural insights from local experts.
          </p>
        </div>

        {/* Language Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {languages.map((language, index) => (
            <button
              key={language.id}
              onClick={() => setActiveLanguage(language.id)}
              className={`feature-card text-center transition-all duration-300 ${
                activeLanguage === language.id 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{language.flag}</div>
              <h3 className="font-semibold text-foreground mb-1">{language.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{language.speakers} speakers</p>
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${language.bgColor} ${language.color} font-medium`}>
                {language.difficulty}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Travel Phrases */}
          <div className="feature-card-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Essential Phrases
              </h3>
              <div className="text-4xl">
                {languages.find(l => l.id === activeLanguage)?.flag}
              </div>
            </div>

            <div className="space-y-4">
              {travelPhrases[activeLanguage as keyof typeof travelPhrases]?.map((phrase, index) => (
                <div 
                  key={index}
                  className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded-full">
                      {phrase.category}
                    </span>
                    <button 
                      onClick={playPhrase}
                      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      {isPlaying ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {phrase.phrase}
                  </div>
                  
                  <div className="text-muted-foreground">
                    {phrase.english}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 btn-outline-hero">
              <BookOpen className="w-4 h-4 mr-2" />
              View Full Phrasebook
            </button>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Powerful Language Tools
            </h3>
            
            {features.map((feature, index) => (
              <Dialog key={index} open={
                (feature.title === 'Voice Translation' && voiceOpen) ||
                (feature.title === 'Chat Assistant' && chatOpen) ||
                (feature.title === 'Local Connect' && connectOpen) || undefined
              } onOpenChange={(open)=>{
                if (feature.title === 'Voice Translation') setVoiceOpen(open);
                if (feature.title === 'Chat Assistant') setChatOpen(open);
                if (feature.title === 'Local Connect') setConnectOpen(open);
              }}>
                <DialogTrigger asChild>
                  <div
                    className="feature-card animate-slide-in-right cursor-pointer"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-muted-foreground mb-3">
                          {feature.description}
                        </p>
                        <span className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-1">
                          Learn more
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{feature.title}</DialogTitle>
                    <DialogDescription>{feature.description}</DialogDescription>
                  </DialogHeader>
                  {feature.title === 'Voice Translation' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Target language:</label>
                        <select value={targetLang} onChange={(e)=>setTargetLang(e.target.value)} className="border border-border rounded px-2 py-1 text-sm">
                          {[
                            ['es','Spanish'],['fr','French'],['de','German'],['ja','Japanese'],['hi','Hindi'],['it','Italian'],['pt','Portuguese'],['zh','Chinese']
                          ].map(([code,label])=> (<option key={code} value={code}>{label}</option>))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={listening? stopListening : startListening} className={`px-4 py-2 rounded-lg ${listening? 'bg-destructive text-white' : 'btn-hero'} text-sm`}>
                          {listening ? 'Stop' : 'Start'} Listening
                        </button>
                        <button onClick={async()=>{ setTranslatedSpeech(await translateLibre(inputSpeech || '', targetLang)); }} className="btn-outline-hero text-sm">Translate</button>
                        <button onClick={()=>speak(translatedSpeech || inputSpeech, targetLang)} className="btn-primary text-sm">Play</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <textarea value={inputSpeech} onChange={(e)=>setInputSpeech(e.target.value)} placeholder="Your speech/text" className="w-full h-28 p-3 border border-border rounded-lg bg-background" />
                        <textarea value={translatedSpeech} onChange={(e)=>setTranslatedSpeech(e.target.value)} placeholder="Translation" className="w-full h-28 p-3 border border-border rounded-lg bg-background" />
                      </div>
                    </div>
                  )}

                  {feature.title === 'Cultural Guide' && (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>Explore do's and don'ts, dining etiquette, and greetings. Pick a country in the grid above to preview tips.</p>
                    </div>
                  )}

                  {feature.title === 'Chat Assistant' && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Quick questions</div>
                        <div className="flex flex-wrap gap-2">
                          {quickPrompts.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setMessages(prev => [...prev, { role: 'user', text: p.q }]);
                                setTimeout(() => setMessages(prev => [...prev, { role: 'assistant', text: p.a }]), 200);
                              }}
                              className="px-3 py-1 rounded-full border border-border text-xs hover:bg-muted transition-colors"
                            >
                              {p.q}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-48 overflow-auto border border-border rounded p-3 bg-muted/30">
                        {messages.length === 0 && <div className="text-muted-foreground text-sm">Ask me anything about language, local phrases, or travel etiquette.</div>}
                        {messages.map((m,i)=> (
                          <div key={i} className={`mb-2 ${m.role==='user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-3 py-2 rounded-xl text-sm ${m.role==='user' ? 'bg-primary text-white' : 'bg-card border border-border'}`}>{m.text}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} className="flex-1 border border-border rounded-lg px-3 py-2 bg-background" placeholder="Type your question..." />
                        <button onClick={sendChat} className="btn-primary">Send</button>
                      </div>
                    </div>
                  )}

                  {feature.title === 'Local Connect' && (
                    <div className="space-y-3">
                      {[
                        { name: 'Ana (Madrid)', langs: 'ES/EN', rating: 4.9 },
                        { name: 'Pierre (Paris)', langs: 'FR/EN', rating: 4.8 },
                        { name: 'Yuki (Tokyo)', langs: 'JA/EN', rating: 4.9 }
                      ].map((g, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <div className="font-medium">{g.name}</div>
                            <div className="text-xs text-muted-foreground">Languages: {g.langs} • Rating: {g.rating}</div>
                          </div>
                          <button className="btn-outline-hero text-sm" onClick={()=>toast.success('Request sent!')}>
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}

            {/* Demo CTA */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Try Voice Translation</h4>
              <p className="text-white/90 mb-4">
                Test our real-time translation with your voice right now.
              </p>
              <button onClick={()=>setVoiceOpen(true)} className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Start Voice Demo
              </button>
            </div>
          </div>
        </div>

        {/* Cultural Tips */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Cultural Insights & Etiquette
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {culturalTips.map((country, index) => (
              <div 
                key={index}
                className="feature-card-premium animate-zoom-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{country.flag}</div>
                  <h4 className="text-xl font-bold text-foreground">{country.country}</h4>
                </div>
                
                <div className="space-y-3">
                  {country.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50">
          {[
            { number: "40+", label: "Languages Supported" },
            { number: "99%", label: "Translation Accuracy" },
            { number: "150+", label: "Countries Covered" },
            { number: "24/7", label: "AI Support" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-ocean mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguageAssistance;
