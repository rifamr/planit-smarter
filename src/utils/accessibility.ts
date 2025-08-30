// Accessibility utilities and WCAG compliance helpers

// Focus management utilities
export const focusManagement = {
  // Trap focus within a container
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  },

  // Return focus to previous element
  returnFocus: (element: HTMLElement) => {
    setTimeout(() => {
      element.focus();
    }, 0);
  },

  // Focus first focusable element
  focusFirst: (container: HTMLElement) => {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (focusable) {
      focusable.focus();
    }
  }
};

// Keyboard navigation helpers
export const keyboardNavigation = {
  // Handle arrow key navigation
  handleArrowKeys: (
    elements: HTMLElement[],
    currentIndex: number,
    onNavigate: (index: number) => void
  ) => {
    return (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
          onNavigate(prevIndex);
          elements[prevIndex]?.focus();
          break;
        
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
          onNavigate(nextIndex);
          elements[nextIndex]?.focus();
          break;
        
        case 'Home':
          e.preventDefault();
          onNavigate(0);
          elements[0]?.focus();
          break;
        
        case 'End':
          e.preventDefault();
          const lastIndex = elements.length - 1;
          onNavigate(lastIndex);
          elements[lastIndex]?.focus();
          break;
      }
    };
  },

  // Handle escape key
  handleEscape: (callback: () => void) => {
    return (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
  }
};

// ARIA helpers
export const ariaHelpers = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix = 'element') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Set ARIA attributes
  setAriaAttributes: (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value);
    });
  },

  // Announce to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.setAttribute('class', 'sr-only');
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
};

// Color contrast utilities
export const colorContrast = {
  // Calculate contrast ratio between two colors
  getContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const toSRGB = (value: number) => {
        value /= 255;
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
      };
      
      return 0.2126 * toSRGB(r) + 0.7152 * toSRGB(g) + 0.0722 * toSRGB(b);
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    
    return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAG: (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrast.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }
};

// Screen reader utilities
export const screenReader = {
  // Add screen reader only text
  addSROnlyText: (element: HTMLElement, text: string) => {
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = text;
    element.appendChild(srText);
  },

  // Remove screen reader only text
  removeSROnlyText: (element: HTMLElement) => {
    const srElements = element.querySelectorAll('.sr-only');
    srElements.forEach(el => el.remove());
  }
};

// Motion and animation preferences
export const motionPreferences = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Respect motion preferences in animations
  respectMotionPreference: (config: {
    animate: any;
    reduceMotion: any;
  }) => {
    return motionPreferences.prefersReducedMotion() ? config.reduceMotion : config.animate;
  }
};

// Form accessibility helpers
export const formAccessibility = {
  // Add error announcements
  announceError: (fieldName: string, errorMessage: string) => {
    ariaHelpers.announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive');
  },

  // Add success announcements
  announceSuccess: (message: string) => {
    ariaHelpers.announce(message, 'polite');
  },

  // Link form fields with error messages
  linkFieldToError: (fieldId: string, errorId: string) => {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    if (field && error) {
      field.setAttribute('aria-describedby', errorId);
      field.setAttribute('aria-invalid', 'true');
    }
  },

  // Remove error associations
  removeErrorAssociation: (fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.removeAttribute('aria-describedby');
      field.removeAttribute('aria-invalid');
    }
  }
};

// Skip links utility
export const skipLinks = {
  // Create skip to main content link
  createSkipLink: () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    return skipLink;
  },

  // Handle skip link navigation
  handleSkipLinkClick: (targetId: string) => {
    return (e: Event) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
};

// Accessibility testing helpers
export const accessibilityTesting = {
  // Find elements without alt text
  findImagesWithoutAlt: (): HTMLImageElement[] => {
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    return Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
  },

  // Find buttons without accessible names
  findButtonsWithoutNames: (): HTMLButtonElement[] => {
    const buttons = document.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    return Array.from(buttons).filter(btn => 
      !btn.textContent?.trim() && 
      !btn.getAttribute('aria-label') && 
      !btn.getAttribute('aria-labelledby')
    );
  },

  // Find form inputs without labels
  findInputsWithoutLabels: (): HTMLInputElement[] => {
    const inputs = document.querySelectorAll('input:not([type="hidden"])') as NodeListOf<HTMLInputElement>;
    return Array.from(inputs).filter(input => {
      const id = input.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
      
      return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
    });
  },

  // Run basic accessibility audit
  runBasicAudit: () => {
    const issues = {
      imagesWithoutAlt: accessibilityTesting.findImagesWithoutAlt(),
      buttonsWithoutNames: accessibilityTesting.findButtonsWithoutNames(),
      inputsWithoutLabels: accessibilityTesting.findInputsWithoutLabels()
    };

    console.log('Accessibility Audit Results:', issues);
    return issues;
  }
};

// Initialize accessibility features
export const initAccessibility = () => {
  if (typeof document === 'undefined') return;

  // Add skip link
  skipLinks.createSkipLink();

  // Add focus visible polyfill for older browsers
  if (!CSS.supports('selector(:focus-visible)')) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  // Listen for reduced motion changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      document.body.classList.toggle('reduce-motion', mediaQuery.matches);
    });
    
    // Set initial state
    document.body.classList.toggle('reduce-motion', mediaQuery.matches);
  }

  // Add high contrast mode detection
  if (window.matchMedia) {
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', () => {
      document.body.classList.toggle('high-contrast', highContrastQuery.matches);
    });
    
    // Set initial state
    document.body.classList.toggle('high-contrast', highContrastQuery.matches);
  }

  // Run accessibility audit in development
  if ((import.meta as any).env?.MODE === 'development') {
    setTimeout(() => {
      accessibilityTesting.runBasicAudit();
    }, 2000);
  }
};

export default {
  focusManagement,
  keyboardNavigation,
  ariaHelpers,
  colorContrast,
  screenReader,
  motionPreferences,
  formAccessibility,
  skipLinks,
  accessibilityTesting,
  initAccessibility
};
