import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  Order, 
  OrderRequest, 
  OrderStatus, 
  OrderItemStatus 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const ordersApi = {
  getOrders: (params?: { status?: OrderStatus; tableId?: number }) => {
    return unwrap<Order[]>(axiosInstance.get(API_ROUTES.ORDERS.BASE, { params }));
  },
  
  getOrder: (id: number) => {
    return unwrap<Order>(axiosInstance.get(`${API_ROUTES.ORDERS.BASE}/${id}`));
  },
  
  placeOrder: (data: OrderRequest) => {
    return unwrap<Order>(axiosInstance.post(API_ROUTES.ORDERS.BASE, data));
  },

  updateOrderStatus: (id: number, status: OrderStatus) => {
    return unwrap<Order>(axiosInstance.patch(`${API_ROUTES.ORDERS.BASE}/${id}/status`, { status }));
  },

  updateOrderItemStatus: (orderId: number, itemId: number, status: OrderItemStatus) => {
    return unwrap<Order>(axiosInstance.patch(`${API_ROUTES.ORDERS.BASE}/${orderId}/items/${itemId}/status`, { status }));
  },

  getKitchenQueue: () => {
    return unwrap<Order[]>(axiosInstance.get(API_ROUTES.ORDERS.KITCHEN_QUEUE));
  },

  getBarQueue: () => {
    return unwrap<Order[]>(axiosInstance.get(API_ROUTES.ORDERS.BAR_QUEUE));
  },

  getMyOrders: (waiterId: number) => {
    return unwrap<Order[]>(axiosInstance.get(`${API_ROUTES.ORDERS.BASE}/waiter/${waiterId}`));
  },
  
  getMyOrdersHistory: (waiterId: number) => {
    return unwrap<Order[]>(axiosInstance.get(`${API_ROUTES.ORDERS.BASE}/waiter/${waiterId}/history`));
  },

  getAllOrders: (page = 0, size = 10) => {
    return unwrap<any>(axiosInstance.get(`${API_ROUTES.ORDERS.BASE}/all`, { params: { page, size } }));
  },

  cancelOrder: (id: number) => {
    return unwrap<void>(axiosInstance.patch(`${API_ROUTES.ORDERS.BASE}/${id}/status`, { status: 'CANCELLED' }));
  },
};

