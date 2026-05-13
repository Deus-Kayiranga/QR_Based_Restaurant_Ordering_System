import { axiosInstance, unwrap } from './axiosInstance';
import type { MenuItem } from '../types';

export interface StockMovement {
  movementId: number;
  itemId: number;
  quantityChanged: number;
  reason: string;
  createdAt: string;
}

export const stockApi = {
  getLowStockAlerts: () => {
    return unwrap<MenuItem[]>(axiosInstance.get('/menu/low-stock'));
  },
  
  adjustStock: (itemId: number, adjustment: number, reason: string) => {
    return unwrap<MenuItem>(axiosInstance.patch(`/menu/${itemId}/stock`, {
      adjustment,
      reason
    }));
  },

  getMovements: (itemId: number) => {
    return unwrap<StockMovement[]>(axiosInstance.get(`/menu/${itemId}/stock-history`));
  }
};
