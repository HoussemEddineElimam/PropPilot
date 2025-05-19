import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property } from '../models/Property';

interface WishlistState {
  items: Property[];
  addToWishlist: (property: Property) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (property: Property) => {
        const { items } = get();
        if (!items.some(item => item._id === property._id)) {
          set({ items: [...items, property] });
        }
      },
      
      removeFromWishlist: (id: string) => {
        const { items } = get();
        set({ items: items.filter(item => item._id !== id) });
      },
      
      clearWishlist: () => set({ items: [] }),
      
      isInWishlist: (id: string) => {
        const { items } = get();
        return items.some(item => item._id === id);
      },
    }),
    {
      name: 'property-wishlist', 
    }
  )
);

export const useWishlist = () => {
  const { 
    items, 
    addToWishlist, 
    removeFromWishlist, 
    clearWishlist, 
    isInWishlist 
  } = useWishlistStore();
  
  return {
    wishlistItems: items,
    wishlistCount: items.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist: (property: Property) => {
      if (isInWishlist(property._id)) {
        removeFromWishlist(property._id);
        return false; 
      } else {
        addToWishlist(property);
        return true; 
      }
    }
  };
};