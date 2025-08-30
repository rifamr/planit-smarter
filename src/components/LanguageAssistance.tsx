import { useState, useEffect } from "react";
import { Globe, Volume2, BookOpen, MessageCircle, Users, Play, ChevronRight, Star } from "lucide-react";

const LanguageAssistance = () => {
  const [activeLanguage, setActiveLanguage] = useState("spanish");
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <section className="section-padding bg-section-alt">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-3 rounded-full mb-6">
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
              <div 
                key={index}
                className="feature-card animate-slide-in-right"
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
                    <button className="text-primary font-medium hover:text-accent transition-colors flex items-center gap-1">
                      Learn more
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Demo CTA */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Try Voice Translation</h4>
              <p className="text-white/90 mb-4">
                Test our real-time translation with your voice right now.
              </p>
              <button className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
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
