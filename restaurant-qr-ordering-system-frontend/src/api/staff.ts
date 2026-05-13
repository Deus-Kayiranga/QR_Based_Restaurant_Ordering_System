import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  User, 
  DashboardStats 
} from '../types';

export const staffApi = {
  getAllUsers: () => {
    return unwrap<User[]>(axiosInstance.get('/users/'));
  },
  
  // alias
  getAll: () => {
    return unwrap<User[]>(axiosInstance.get('/users/'));
  },
  
  updateUser: (id: number, body: any) => {
    return unwrap<User>(axiosInstance.patch(`/users/${id}`, body));
  },

  deactivateUser: (id: number) => {
    return unwrap<void>(axiosInstance.patch(`/users/${id}/deactivate`));
  },

  activateUser: (id: number) => {
    return unwrap<void>(axiosInstance.patch(`/users/${id}/activate`));
  },

  getManagerDashboard: () => {
    return unwrap<DashboardStats>(axiosInstance.get('/dashboard/manager'));
  },

  getActivityLogs: (params?: { page?: number; size?: number }) => {
    return unwrap<any>(axiosInstance.get('/system/logs', { params }));
  },

  getAdminDashboard: () => {
    return unwrap<DashboardStats>(axiosInstance.get('/dashboard/admin'));
  },

  getKitchenStats: () => {
    return unwrap<any>(axiosInstance.get('/dashboard/kitchen'));
  },

  getCashierSummary: () => {
    return unwrap<any>(axiosInstance.get('/dashboard/cashier'));
  }
};
