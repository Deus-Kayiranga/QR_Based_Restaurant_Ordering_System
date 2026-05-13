import { axiosInstance, unwrap } from './axiosInstance';
import type { DashboardStats, KitchenStats } from '../types';

export const dashboardApi = {
  getAdminStats: () => {
    return unwrap<DashboardStats>(axiosInstance.get('/dashboard/admin'));
  },
  getManagerStats: () => {
    return unwrap<DashboardStats>(axiosInstance.get('/dashboard/manager'));
  },
  getKitchenStats: () => {
    return unwrap<any>(axiosInstance.get('/dashboard/kitchen'));
  },
  getBarStats: () => {
    return unwrap<any>(axiosInstance.get('/dashboard/bar'));
  },
  getCashierStats: () => {
    return unwrap<any>(axiosInstance.get('/dashboard/cashier'));
  }
};
