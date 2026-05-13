import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  Payment, 
  CashPaymentRequest, 
  MobileMoneyPaymentRequest 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const paymentsApi = {
  payCash: (data: CashPaymentRequest) => {
    return unwrap<Payment>(axiosInstance.post(`${API_ROUTES.PAYMENTS.BASE}/cash`, data));
  },
  
  payMoMo: (data: MobileMoneyPaymentRequest) => {
    return unwrap<Payment>(axiosInstance.post(`${API_ROUTES.PAYMENTS.BASE}/momo`, data));
  },

  payAirtel: (data: MobileMoneyPaymentRequest) => {
    return unwrap<Payment>(axiosInstance.post(`${API_ROUTES.PAYMENTS.BASE}/airtel`, data));
  },

  processMobilePayment: (data: MobileMoneyPaymentRequest) => {
    return unwrap<Payment>(axiosInstance.post(`${API_ROUTES.PAYMENTS.BASE}/customer`, data));
  },

  getPaymentHistory: (params?: { date?: string }) => {
    return unwrap<Payment[]>(axiosInstance.get(API_ROUTES.PAYMENTS.BASE, { params }));
  },

  getTodaySummary: () => {
    return unwrap<any>(axiosInstance.get(API_ROUTES.PAYMENTS.SUMMARY));
  }
};
