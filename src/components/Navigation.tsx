import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Sparkles, Globe, Leaf, User, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const eco = localStorage.getItem('ecoMode') === '1';
    document.documentElement.classList.toggle('eco', eco);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
      setActiveDropdown(null);
    }
  };

  const navigationItems = [
    {
      label: "How It Works",
      id: "how-it-works",
      icon: Sparkles
    },
    {
      label: "Destinations",
      id: "featured-destinations",
      icon: MapPin,
      dropdown: [
        { label: "Popular Destinations", id: "featured-destinations" },
        { label: "Eco-Friendly Spots", id: "sustainability-mode" },
        { label: "Hidden Gems", id: "featured-destinations" }
      ]
    },
    {
      label: "Features",
      id: "features",
      icon: Globe,
      dropdown: [
        { label: "AI Trip Planning", id: "itinerary-generator" },
        { label: "Language Assistant", id: "language-assistance" },
        { label: "Sustainability Mode", id: "sustainability-mode" }
      ]
    },
    {
      label: "Pricing",
      id: "pricing",
      icon: User
    },
    {
      label: "Blog",
      id: "travel-blog",
      icon: Leaf
    }
  ];

  const handleDropdownToggle = (itemLabel: string) => {
    setActiveDropdown(activeDropdown === itemLabel ? null : itemLabel);
  };

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-primary to-accent' 
                  : 'bg-white/20 backdrop-blur-sm border border-white/30'
              }`}>
                <MapPin className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}>
                PlanIt Smarter
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item, index) => (
                <div key={item.label} className="relative group">
                  <motion.button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isScrolled 
                        ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => item.dropdown ? handleDropdownToggle(item.label) : scrollToSection(item.id)}
                    onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    )}
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.label && (
                      <motion.div
                        className={`absolute top-full left-0 mt-2 w-56 rounded-xl shadow-lg border ${
                          isScrolled 
                            ? 'bg-white border-border/50' 
                            : 'bg-white/95 backdrop-blur-md border-white/20'
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-2">
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <motion.button
                              key={dropdownItem.label}
                              className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                              onClick={() => scrollToSection(dropdownItem.id)}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: dropdownIndex * 0.05, duration: 0.2 }}
                              whileHover={{ x: 4 }}
                            >
                              {dropdownItem.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Buttons + Theme */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                aria-label="Eco mode"
                onClick={() => {
                  const el = document.documentElement;
                  const on = !el.classList.contains('eco');
                  el.classList.toggle('eco', on);
                  localStorage.setItem('ecoMode', on ? '1' : '0');
                }}
                className={`relative w-10 h-10 rounded-full border ${isScrolled ? 'border-border text-foreground bg-card' : 'border-white/30 text-white/90 bg-white/10'} hover:shadow-lg transition flex items-center justify-center`}
              >
                <Leaf className="w-5 h-5 text-green-500" />
              </button>
              <ThemeToggle inline />
              <motion.button
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-muted-foreground hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
                onClick={() => scrollToSection('pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>

              <motion.button
                className="btn-primary"
                onClick={() => scrollToSection('itinerary-generator')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Planning
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled 
                  ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-16 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-50 lg:hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="p-6">
                <div className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <button
                        className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                        onClick={() => item.dropdown ? handleDropdownToggle(item.label) : scrollToSection(item.id)}
                      >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item.label}</span>
                        {item.dropdown && (
                          <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        )}
                      </button>

                      {/* Mobile Dropdown */}
                      <AnimatePresence>
                        {item.dropdown && activeDropdown === item.label && (
                          <motion.div
                            className="ml-8 mt-2 space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.dropdown.map((dropdownItem, dropdownIndex) => (
                              <motion.button
                                key={dropdownItem.label}
                                className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
                                onClick={() => scrollToSection(dropdownItem.id)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: dropdownIndex * 0.05, duration: 0.2 }}
                              >
                                {dropdownItem.label}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/50">
                  <div className="flex justify-end mb-2 gap-2">
                    <button
                      aria-label="Eco mode"
                      onClick={() => {
                        const el = document.documentElement;
                        const on = !el.classList.contains('eco');
                        el.classList.toggle('eco', on);
                        localStorage.setItem('ecoMode', on ? '1' : '0');
                      }}
                      className="relative w-10 h-10 rounded-full border border-border text-foreground bg-card hover:shadow-md transition flex items-center justify-center"
                    >
                      <Leaf className="w-5 h-5 text-green-500" />
                    </button>
                    <ThemeToggle inline />
                  </div>
                  <motion.button
                    className="w-full py-3 text-center font-medium text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-primary/10"
                    onClick={() => scrollToSection('pricing')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    Sign In
                  </motion.button>

                  <motion.button
                    className="w-full btn-primary"
                    onClick={() => scrollToSection('itinerary-generator')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    Start Planning
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
