// src/utils/localStorage.ts
// Import the one true CartItem type from its source
import { CartItem } from "@/redux/slices/cartSlice";

export const loadCartState = (): CartItem[] => {
  try {
    const serializedState = localStorage.getItem('cartItems');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load cart state from localStorage", err);
    return [];
  }
};

export const saveCartState = (items: CartItem[]): void => {
  try {
    const serializedState = JSON.stringify(items);
    localStorage.setItem('cartItems', serializedState);
  } catch (err) {
    console.error("Could not save cart state to localStorage", err);
  }
};