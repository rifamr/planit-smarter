import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

type Props = { inline?: boolean };
const ThemeToggle = ({ inline = false }: Props) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const baseClasses = inline
    ? "relative w-10 h-10 bg-card border border-border rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center group"
    : "fixed top-24 right-4 lg:right-8 z-60 w-12 h-12 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group";

  return (
    <button
      onClick={toggleTheme}
      className={baseClasses}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
