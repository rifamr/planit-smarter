import { useState } from "react";
import { Check, Star, Zap, Crown, Users, ArrowRight, Sparkles } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Explorer",
      icon: Users,
      description: "Perfect for occasional travelers",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      features: [
        "1 trip per month",
        "Basic AI itineraries",
        "Essential travel phrases",
        "Community support",
        "Standard destinations"
      ],
      limitations: [
        "No premium destinations",
        "Limited customization",
        "Basic support only"
      ]
    },
    {
      id: "pro",
      name: "Adventurer",
      icon: Zap,
      description: "For serious travelers who want more",
      monthlyPrice: 19,
      annualPrice: 15,
      popular: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
      features: [
        "Unlimited trips",
        "Advanced AI personalization",
        "Sustainability mode",
        "Real-time updates",
        "Priority support",
        "Premium destinations",
        "Cultural insights",
        "Offline access",
        "Multi-language support"
      ],
      limitations: []
    },
    {
      id: "premium",
      name: "Globetrotter",
      icon: Crown,
      description: "Ultimate travel planning experience",
      monthlyPrice: 39,
      annualPrice: 29,
      popular: false,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      features: [
        "Everything in Adventurer",
        "Personal travel concierge",
        "Custom trip collaboration",
        "VIP booking assistance",
        "Exclusive experiences",
        "Group planning tools",
        "Advanced analytics",
        "White-glove support",
        "Early feature access"
      ],
      limitations: []
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely."
    },
    {
      question: "Can I change plans later?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be prorated based on your billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      plan: "Adventurer",
      text: "The AI personalization is incredible! It planned my perfect 2-week Japan trip down to the smallest details.",
      rating: 5,
      avatar: "🌟"
    },
    {
      name: "Marcus Torres",
      plan: "Globetrotter", 
      text: "The concierge service made our family reunion in Italy absolutely seamless. Worth every penny!",
      rating: 5,
      avatar: "👨‍👩‍👧‍👦"
    },
    {
      name: "Elena Rodriguez",
      plan: "Adventurer",
      text: "Sustainability mode helped me find amazing eco-friendly options I never would have discovered alone.",
      rating: 5,
      avatar: "🌱"
    }
  ];

  const additionalFeatures = [
    {
      icon: Sparkles,
      title: "AI Trip Companions",
      description: "Foodie, History, Adventure personalities"
    },
    {
      icon: Users,
      title: "Social Features",
      description: "Share trips and connect with travelers"
    },
    {
      icon: Star,
      title: "Premium Support",
      description: "24/7 multilingual customer service"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-responsive-xl font-bold text-foreground mb-6">
            Choose Your <span className="text-gradient-primary">Adventure</span>
          </h2>
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto mb-8">
            Start planning smarter trips today. All plans include our core AI features 
            with premium options for serious travelers.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-muted rounded-xl p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                !isAnnual 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                isAnnual 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`feature-card-premium relative ${
                plan.popular 
                  ? 'ring-2 ring-primary shadow-xl scale-105' 
                  : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${plan.bgColor} ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-foreground">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-muted-foreground">
                        /{isAnnual ? 'month' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed annually (${(isAnnual ? plan.annualPrice : plan.monthlyPrice) * 12}/year)
                    </p>
                  )}
                </div>

                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'btn-hero'
                      : plan.id === 'free'
                      ? 'btn-outline-hero'
                      : 'bg-muted text-foreground hover:bg-primary hover:text-white'
                  }`}
                >
                  {plan.id === 'free' ? 'Start Free' : 'Start 14-Day Trial'}
                  <ArrowRight className="w-4 h-4 ml-2 inline" />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">Not included:</h5>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Compare All Features
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl shadow-lg">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-6 font-semibold text-foreground">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-6">
                      <div className={`inline-flex items-center gap-2 ${plan.color}`}>
                        <plan.icon className="w-5 h-5" />
                        <span className="font-semibold">{plan.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "AI Trip Planning", values: ["Basic", "Advanced", "Premium AI"] },
                  { feature: "Monthly Trips", values: ["1", "Unlimited", "Unlimited"] },
                  { feature: "Sustainability Mode", values: ["—", "✓", "✓"] },
                  { feature: "Real-time Updates", values: ["—", "✓", "✓"] },
                  { feature: "Premium Destinations", values: ["—", "✓", "✓"] },
                  { feature: "Personal Concierge", values: ["—", "—", "✓"] },
                  { feature: "Group Planning", values: ["—", "—", "✓"] },
                  { feature: "Priority Support", values: ["—", "✓", "White-glove"] }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border/30 last:border-0">
                    <td className="p-6 font-medium text-foreground">{row.feature}</td>
                    {row.values.map((value, valueIndex) => (
                      <td key={valueIndex} className="p-6 text-center text-muted-foreground">
                        {value === "✓" ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : value === "—" ? (
                          <span className="text-muted-foreground/50">—</span>
                        ) : (
                          <span>{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            What Our Travelers Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="feature-card animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-primary">{testimonial.plan} Plan</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="feature-card animate-zoom-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-semibold text-foreground mb-3">{faq.question}</h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Every Plan Includes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Start with our free plan and upgrade anytime as your travel needs grow.
            </p>
            <button className="btn-hero">
              Start Your Journey Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
