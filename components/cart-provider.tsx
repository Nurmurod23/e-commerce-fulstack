"use client";

import React, { createContext, useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      total
      status
    }
  }
`;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  checkout: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const [createOrder] = useMutation(CREATE_ORDER);

  const addItem = (item: CartItem) => {
    if (!user) {
      toast.error('Please sign in to add items to cart', {
        action: {
          label: 'Sign In',
          onClick: () => router.push('/auth/signin'),
        },
      });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    toast.success('Added to cart');
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      router.push('/auth/signin');
      return false;
    }

    try {
      const { data } = await createOrder({
        variables: {
          input: {
            items: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          },
        },
      });

      if (data.createOrder) {
        clearCart();
        toast.success('Order placed successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to place order');
      return false;
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        total,
        checkout 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};