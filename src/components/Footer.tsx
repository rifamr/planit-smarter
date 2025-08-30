import { MapPin, Mail, Twitter, Instagram, Facebook, Youtube, Leaf } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Travel Blog", href: "#travel-blog" }
  ];

  const support = [
    { label: "Help Center", href: "#help" },
    { label: "Contact Support", href: "#contact" },
    { label: "Travel Insurance", href: "#insurance" },
    { label: "Booking Help", href: "#booking" },
    { label: "Safety Tips", href: "#safety" }
  ];

  const legal = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "Refund Policy", href: "#refunds" }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Youtube, href: "#youtube", label: "YouTube" }
  ];

  return (
    <footer className="bg-foreground text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">PlanIt Smarter</h3>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-6 max-w-md">
              Revolutionizing travel planning with AI-powered personalization and 
              sustainable tourism. Create unforgettable journeys that respect our planet.
            </p>
            
            <div className="flex items-center gap-2 text-secondary mb-6">
              <Leaf className="w-5 h-5" />
              <span className="font-medium">Committed to Sustainable Travel</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/70">
              <Mail className="w-5 h-5" />
              <span>hello@planitsmarter.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link.href.replace('#','');
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        alert('Coming soon');
                      }
                    }}
                    className="text-white/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link.href.replace('#','');
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        alert('Coming soon');
                      }
                    }}
                    className="text-white/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              {legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link.href.replace('#','');
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        alert('Coming soon');
                      }
                    }}
                    className="text-white/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-white/60 text-center md:text-left">
              <p>© 2024 PlanIt Smarter. All rights reserved.</p>
              <p className="text-sm mt-1">
                Powered by AI • Built for Sustainable Travel
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  onClick={(e) => { e.preventDefault(); alert('Coming soon'); }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-white/70 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm">
              <span>🔒 Secure Payments</span>
              <span>🌍 180+ Countries</span>
              <span>⭐ 4.9/5 Rating</span>
              <span>🏆 Award Winning</span>
              <span>🌱 Carbon Neutral</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
