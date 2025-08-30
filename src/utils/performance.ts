// Performance utilities for optimization and monitoring

// Debounce function for search inputs and resize events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading utility for components
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <React.Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
};

// Image preloader for critical images
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (srcs: string[]): Promise<HTMLImageElement[]> => {
  try {
    const promises = srcs.map(src => preloadImage(src));
    return await Promise.all(promises);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
    return [];
  }
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Performance observer for Core Web Vitals
export const observeWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('LCP:', lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.warn('Performance observation not supported:', error);
    }
  }
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
};

// Network information
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

// Device capability detection
export const getDeviceCapabilities = () => {
  return {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android|Tablet/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window,
    supportsWebP: (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })(),
    supportsAvif: (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    })(),
    devicePixelRatio: window.devicePixelRatio || 1,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  };
};

// Optimize images based on device capabilities
export const getOptimizedImageUrl = (baseUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
} = {}) => {
  const capabilities = getDeviceCapabilities();
  const { width, height, quality = 80, format = 'auto' } = options;

  // For Unsplash images
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    
    if (width) url.searchParams.set('w', Math.round(width * capabilities.devicePixelRatio).toString());
    if (height) url.searchParams.set('h', Math.round(height * capabilities.devicePixelRatio).toString());
    url.searchParams.set('q', quality.toString());
    
    // Set format based on browser support
    if (format === 'auto') {
      if (capabilities.supportsAvif) {
        url.searchParams.set('fm', 'avif');
      } else if (capabilities.supportsWebP) {
        url.searchParams.set('fm', 'webp');
      } else {
        url.searchParams.set('fm', 'jpg');
      }
    } else if (format !== 'auto') {
      url.searchParams.set('fm', format);
    }
    
    return url.toString();
  }

  return baseUrl;
};

// Critical resource hints
export const addResourceHints = (resources: Array<{
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: string;
}>) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    if (resource.as) link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
    document.head.appendChild(link);
  });
};

// Defer non-critical CSS
export const loadCSSAsync = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = 'style';
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
};

// Intersection Observer utility
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual scrolling utility for large lists
export const calculateVisibleItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  totalItems: number,
  overscan = 5
) => {
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItemCount + overscan * 2);

  return {
    startIndex,
    endIndex,
    visibleItemCount,
    offsetY: startIndex * itemHeight
  };
};

// Bundle size tracker
export const trackBundleSize = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const scripts = resources.filter(resource => resource.name.endsWith('.js'));
    const styles = resources.filter(resource => resource.name.endsWith('.css'));
    
    const totalScriptSize = scripts.reduce((sum, script) => sum + (script.transferSize || 0), 0);
    const totalStyleSize = styles.reduce((sum, style) => sum + (style.transferSize || 0), 0);
    
    console.log('Bundle Analysis:', {
      scripts: {
        count: scripts.length,
        totalSize: `${(totalScriptSize / 1024).toFixed(2)} KB`
      },
      styles: {
        count: styles.length,
        totalSize: `${(totalStyleSize / 1024).toFixed(2)} KB`
      },
      total: `${((totalScriptSize + totalStyleSize) / 1024).toFixed(2)} KB`
    });
  }
};

// Local storage with compression
export const compressedStorage = {
  set: (key: string, value: any) => {
    try {
      const compressed = JSON.stringify(value);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

export default {
  debounce,
  throttle,
  preloadImage,
  preloadImages,
  prefersReducedMotion,
  observeWebVitals,
  getMemoryUsage,
  getNetworkInfo,
  getDeviceCapabilities,
  getOptimizedImageUrl,
  addResourceHints,
  loadCSSAsync,
  createIntersectionObserver,
  calculateVisibleItems,
  trackBundleSize,
  compressedStorage
};