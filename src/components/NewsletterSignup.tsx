import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, AlertCircle, Loader2, ArrowRight, Gift } from "lucide-react";

interface NewsletterSignupProps {
  variant?: 'default' | 'hero' | 'footer' | 'modal';
  showBenefits?: boolean;
  className?: string;
}

const NewsletterSignup = ({ 
  variant = 'default', 
  showBenefits = true,
  className = ""
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call - Replace with actual newsletter service
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock success/error for demonstration
          if (email.includes('test@error.com')) {
            reject(new Error('Subscription failed'));
          } else {
            resolve('success');
          }
        }, 2000);
      });

      // In production, integrate with services like:
      // - Mailchimp: https://mailchimp.com/developer/marketing/api/
      // - SendGrid: https://docs.sendgrid.com/api-reference
      // - ConvertKit: https://developers.convertkit.com/
      // - Newsletter API: https://newsletter-api.com/docs

      setStatus('success');
      setEmail('');
      
      // Track conversion
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'newsletter_signup', {
          event_category: 'engagement',
          event_label: variant
        });
      }
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again.');
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: "🎯",
      text: "Weekly travel tips & destination insights"
    },
    {
      icon: "💰", 
      text: "Exclusive deals & early access to features"
    },
    {
      icon: "🌍",
      text: "Sustainable travel guides & eco-tips"
    },
    {
      icon: "📱",
      text: "Latest AI travel planning updates"
    }
  ];

  const variants = {
    default: {
      container: "bg-card rounded-2xl p-8 border border-border/50",
      title: "text-2xl font-bold text-foreground mb-4",
      subtitle: "text-muted-foreground mb-6",
      form: "space-y-4"
    },
    hero: {
      container: "bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20",
      title: "text-3xl font-bold text-foreground mb-4",
      subtitle: "text-muted-foreground mb-6",
      form: "space-y-6"
    },
    footer: {
      container: "bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6",
      title: "text-xl font-bold text-foreground mb-3",
      subtitle: "text-sm text-muted-foreground mb-4",
      form: "space-y-3"
    },
    modal: {
      container: "bg-card rounded-2xl p-6",
      title: "text-xl font-bold text-foreground mb-3",
      subtitle: "text-sm text-muted-foreground mb-4",
      form: "space-y-4"
    }
  };

  const currentVariant = variants[variant];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${currentVariant.container} ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-green-600" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">
              Welcome to the Club! 🎉
            </h3>
            
            <p className="text-muted-foreground mb-4">
              Thanks for subscribing! Check your inbox for a welcome email with your first travel tip.
            </p>
            
            <motion.button
              onClick={() => {
                setStatus('idle');
                setEmail('');
              }}
              className="btn-outline-hero"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe Another Email
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div variants={itemVariants} className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                {variant === 'hero' && <Gift className="w-6 h-6 text-accent" />}
              </div>
              
              <h3 className={currentVariant.title}>
                {variant === 'hero' ? 'Get Your Free Travel Planning Kit' :
                 variant === 'footer' ? 'Stay Updated' :
                 'Never Miss a Travel Tip'}
              </h3>
              
              <p className={currentVariant.subtitle}>
                {variant === 'hero' 
                  ? 'Join 50,000+ smart travelers getting exclusive insights, deals, and AI-powered travel tips.'
                  : 'Get weekly travel insights, destination guides, and exclusive deals delivered to your inbox.'
                }
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className={currentVariant.form}>
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      status === 'error' 
                        ? 'border-destructive' 
                        : 'border-border'
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-destructive text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      {variant === 'hero' ? 'Get My Free Kit' : 'Subscribe Now'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {showBenefits && (
                <motion.div variants={itemVariants} className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">
                    What you'll get:
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="text-lg leading-none">{benefit.icon}</span>
                        <span>{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <p className="text-xs text-muted-foreground text-center">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsletterSignup;
