import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';
import { waiterApi } from '../api/waiter';

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id),
    refetchInterval: 10000, // Refresh every 10s
    enabled: !!id,
  });
};

export const useKitchenQueue = () => {
  return useQuery({
    queryKey: ['kitchenQueue'],
    queryFn: () => ordersApi.getKitchenQueue(),
    refetchInterval: 5000, // Refresh every 5s
  });
};

export const useBarQueue = () => {
  return useQuery({
    queryKey: ['barQueue'],
    queryFn: () => ordersApi.getBarQueue(),
    refetchInterval: 5000,
  });
};

export const useWaiterOrders = (waiterId?: number) => {
  return useQuery({
    queryKey: ['waiterOrders', waiterId],
    queryFn: () => ordersApi.getMyOrders(waiterId!),
    refetchInterval: 10000,
    enabled: !!waiterId,
  });
};

export const useWaiterOrdersHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['waiterOrdersHistory'],
    queryFn: () => waiterApi.getMyOrdersHistory(),
    refetchInterval: 30000,
    enabled,
  });
};

export const useOrders = (page = 0, size = 50) => {
  return useQuery({
    queryKey: ['orders', 'all', page, size],
    queryFn: () => ordersApi.getAllOrders(page, size),
    refetchInterval: 15000,
  });
};
