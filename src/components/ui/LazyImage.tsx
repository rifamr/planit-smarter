import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkwyNCAyNE0yNCAxNkwxNiAyNCIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=",
  fallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkVGRUZFIiBzdHJva2U9IiNFNUU3RUIiLz4KPHA==\"",
  loading = "lazy",
  sizes,
  srcSet,
  onLoad,
  onError,
  priority = false
}: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Convert image to WebP if browser supports it
  const getOptimizedSrc = (originalSrc: string) => {
    // Check if browser supports WebP
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const webpSupported = ctx && canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // For Unsplash images, we can add format parameter
    if (originalSrc.includes('unsplash.com') && webpSupported) {
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', '80'); // Optimize quality
      return url.toString();
    }
    
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Loading state */}
      <motion.img
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: imageLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Actual image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={imageError ? fallback : optimizedSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={loading}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: imageLoaded ? 1 : 0, 
            scale: imageLoaded ? 1 : 1.1 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ backfaceVisibility: 'hidden' }} // Prevent flicker on some browsers
        />
      )}

      {/* Loading indicator */}
      {!imageLoaded && !imageError && isInView && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-muted/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}

      {/* Error state */}
      {imageError && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LazyImage;
