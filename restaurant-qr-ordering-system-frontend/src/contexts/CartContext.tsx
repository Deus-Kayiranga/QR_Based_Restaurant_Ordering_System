import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  tableId: number | null;
  sessionToken: string | null;
  addItem: (item: MenuItem, quantity: number, notes: string, customizations: string[]) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  setTableInfo: (tableId: number, sessionToken: string) => void;
  cartCount: number;
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tableId, setTableId] = useState<number | null>(() => {
    const saved = localStorage.getItem('tableId');
    return saved ? parseInt(saved, 10) : null;
  });
  
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem('sessionToken');
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (tableId) localStorage.setItem('tableId', tableId.toString());
    if (sessionToken) localStorage.setItem('sessionToken', sessionToken);
  }, [tableId, sessionToken]);

  const addItem = (menuItem: MenuItem, quantity: number, specialNotes: string, customizations: string[]) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.itemId === menuItem.itemId);
      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
          specialNotes: specialNotes || newItems[existingIndex].specialNotes,
          customizations: [...new Set([...newItems[existingIndex].customizations, ...customizations])],
        };
        return newItems;
      }
      return [...prev, { menuItem, quantity, specialNotes, customizations }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItem.itemId !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItem.itemId === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const setTableInfo = (id: number, token: string) => {
    setTableId(id);
    setSessionToken(token);
  };

  const cartSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }, [items]);

  const cartTax = useMemo(() => cartSubtotal * 0.18, [cartSubtotal]);
  const cartTotal = useMemo(() => cartSubtotal + cartTax, [cartSubtotal, cartTax]);
  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        tableId,
        sessionToken,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setTableInfo,
        cartCount,
        cartTotal,
        cartSubtotal,
        cartTax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
