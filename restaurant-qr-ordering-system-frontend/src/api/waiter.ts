import { axiosInstance, unwrap } from './axiosInstance';
import type { Order, RestaurantTable } from '../types';

export const waiterApi = {
  getMyTables: () => {
    return unwrap<RestaurantTable[]>(axiosInstance.get('/waiter/my-tables'));
  },
  
  getMyOrders: () => {
    return unwrap<Order[]>(axiosInstance.get('/waiter/my-orders'));
  },
 
  getMyOrdersHistory: () => {
    return unwrap<Order[]>(axiosInstance.get('/waiter/my-orders-history'));
  },

  serveItem: (orderId: number, orderItemId: number) => {
    return unwrap<void>(axiosInstance.patch(`/orders/${orderId}/items/${orderItemId}/status`, {
      status: 'SERVED'
    }));
  }
};
