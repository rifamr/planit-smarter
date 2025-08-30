import { useState, useEffect } from 'react';
import { compressedStorage } from '@/utils/performance';

export interface FavoriteItem {
  id: string;
  type: 'destination' | 'itinerary' | 'activity';
  name: string;
  image?: string;
  description?: string;
  price?: number;
  rating?: number;
  addedAt: string;
  metadata?: Record<string, any>;
}

const FAVORITES_STORAGE_KEY = 'planit-smarter-favorites';
const MAX_FAVORITES = 100; // Prevent storage overflow

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = compressedStorage.get(FAVORITES_STORAGE_KEY) || [];
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites : []);
    } catch (error) {
      console.warn('Failed to load favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        compressedStorage.set(FAVORITES_STORAGE_KEY, favorites);
      } catch (error) {
        console.warn('Failed to save favorites:', error);
      }
    }
  }, [favorites, isLoading]);

  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (favorites.length >= MAX_FAVORITES) {
      console.warn('Maximum favorites limit reached');
      return false;
    }

    if (isFavorite(item.id)) {
      console.warn('Item already in favorites');
      return false;
    }

    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString()
    };

    setFavorites(prev => [newFavorite, ...prev]);
    return true;
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
    return true;
  };

  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.id)) {
      return removeFavorite(item.id);
    } else {
      return addFavorite(item);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const getFavoritesByType = (type: FavoriteItem['type']) => {
    return favorites.filter(item => item.type === type);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    compressedStorage.remove(FAVORITES_STORAGE_KEY);
  };

  const getFavoriteById = (id: string) => {
    return favorites.find(item => item.id === id);
  };

  const updateFavorite = (id: string, updates: Partial<FavoriteItem>) => {
    setFavorites(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planit-smarter-favorites-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFavorites = async (file: File) => {
    try {
      const text = await file.text();
      const importedFavorites = JSON.parse(text);
      
      if (!Array.isArray(importedFavorites)) {
        throw new Error('Invalid file format');
      }

      // Validate and merge favorites
      const validFavorites = importedFavorites.filter((item: any) => 
        item.id && item.type && item.name && item.addedAt
      );

      // Remove duplicates
      const existingIds = favorites.map(f => f.id);
      const newFavorites = validFavorites.filter((item: FavoriteItem) => 
        !existingIds.includes(item.id)
      );

      const totalAfterImport = favorites.length + newFavorites.length;
      if (totalAfterImport > MAX_FAVORITES) {
        const allowedCount = MAX_FAVORITES - favorites.length;
        newFavorites.splice(allowedCount);
      }

      setFavorites(prev => [...prev, ...newFavorites]);
      return {
        success: true,
        imported: newFavorites.length,
        skipped: validFavorites.length - newFavorites.length
      };
    } catch (error) {
      console.error('Failed to import favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const getStats = () => {
    const byType = favorites.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostRecentDate = favorites.length > 0 
      ? Math.max(...favorites.map(f => new Date(f.addedAt).getTime()))
      : null;

    const oldestDate = favorites.length > 0
      ? Math.min(...favorites.map(f => new Date(f.addedAt).getTime()))
      : null;

    return {
      total: favorites.length,
      byType,
      mostRecent: mostRecentDate ? new Date(mostRecentDate) : null,
      oldest: oldestDate ? new Date(oldestDate) : null,
      limit: MAX_FAVORITES,
      remaining: MAX_FAVORITES - favorites.length
    };
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearAllFavorites,
    getFavoriteById,
    updateFavorite,
    exportFavorites,
    importFavorites,
    getStats
  };
};

export default useFavorites;
