// src/redux/CartPersistence.tsx
"use client";

import { useEffect } from 'react';
import { useAppSelector } from './hooks';
import { saveCartState } from '@/utils/localStorage';

export default function CartPersistence() {
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    // No error here now, because the type from the selector matches
    // the type expected by the saveCartState function.
    saveCartState(cartItems);
  }, [cartItems]);

  return null;
}