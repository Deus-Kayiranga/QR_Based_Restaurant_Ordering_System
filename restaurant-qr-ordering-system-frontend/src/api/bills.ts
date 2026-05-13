import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  Bill, 
  BillStatus 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const billsApi = {
  getBills: (params?: { status?: BillStatus; page?: number; size?: number }) => {
    return unwrap<any>(axiosInstance.get(API_ROUTES.BILLS.BASE, { params }));
  },
  
  getBill: (id: number) => {
    return unwrap<Bill>(axiosInstance.get(`${API_ROUTES.BILLS.BASE}/${id}`));
  },

  getBillByOrder: (orderId: number) => {
    return unwrap<Bill>(axiosInstance.get(`${API_ROUTES.BILLS.BASE}/order/${orderId}`));
  },

  getPendingBills: () => {
    return unwrap<Bill[]>(axiosInstance.get(API_ROUTES.BILLS.PENDING));
  },

  generateBill: (orderId: number) => {
    return unwrap<Bill>(axiosInstance.post(`${API_ROUTES.BILLS.BASE}/order/${orderId}`));
  }
};
