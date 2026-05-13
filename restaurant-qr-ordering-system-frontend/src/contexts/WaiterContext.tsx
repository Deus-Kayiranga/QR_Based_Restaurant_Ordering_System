import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, RestaurantTable } from '../types';
import { waiterApi } from '../api/waiter';
import { useAuth } from './AuthContext';

interface WaiterContextType {
  myTables: RestaurantTable[];
  myOrders: Order[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  markAsServed: (orderId: number, itemId: number) => Promise<void>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [myTables, setMyTables] = useState<RestaurantTable[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user || !['WAITER', 'MANAGER', 'SUPER_ADMIN'].includes(user.role)) return;
    
    try {
      setIsLoading(true);
      const [tables, orders] = await Promise.all([
        waiterApi.getMyTables(),
        waiterApi.getMyOrders()
      ]);
      setMyTables(tables);
      setMyOrders(orders);
    } catch (error) {
      console.error('Failed to fetch waiter data', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && ['WAITER', 'MANAGER', 'SUPER_ADMIN'].includes(user.role)) {
      refreshData();
      
      // Setup interval for refreshing (or use WebSockets if available)
      const interval = setInterval(refreshData, 30000); 
      return () => clearInterval(interval);
    }
  }, [user, refreshData]);

  const markAsServed = async (orderId: number, itemId: number) => {
    try {
      await waiterApi.serveItem(orderId, itemId);
      await refreshData();
    } catch (error) {
      console.error('Failed to mark item as served', error);
      throw error;
    }
  };

  return (
    <WaiterContext.Provider
      value={{
        myTables,
        myOrders,
        isLoading,
        refreshData,
        markAsServed
      }}
    >
      {children}
    </WaiterContext.Provider>
  );
};

export const useWaiter = () => {
  const context = useContext(WaiterContext);
  if (context === undefined) {
    throw new Error('useWaiter must be used within a WaiterProvider');
  }
  return context;
};
