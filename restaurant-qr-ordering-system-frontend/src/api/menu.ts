import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  MenuItem, 
  MenuCategory, 
  PaginatedResponse 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const menuApi = {
  getCategories: () => {
    return unwrap<MenuCategory[]>(axiosInstance.get(API_ROUTES.MENU.CATEGORIES));
  },
  
  getItems: (params?: { categoryId?: number; search?: string; page?: number; size?: number }) => {
    return unwrap<PaginatedResponse<MenuItem>>(axiosInstance.get(API_ROUTES.MENU.ITEMS, { params }));
  },

  getMenu: () => {
    return unwrap<MenuItem[]>(axiosInstance.get(`${API_ROUTES.MENU.ITEMS}/available`));
  },
  
  getItem: (id: number) => {
    return unwrap<MenuItem>(axiosInstance.get(`${API_ROUTES.MENU.ITEMS}/${id}`));
  },

  createItem: (data: Partial<MenuItem>) => {
    return unwrap<MenuItem>(axiosInstance.post(API_ROUTES.MENU.ITEMS, data));
  },

  updateItem: (id: number, data: Partial<MenuItem>) => {
    return unwrap<MenuItem>(axiosInstance.put(`${API_ROUTES.MENU.ITEMS}/${id}`, data));
  },

  deleteItem: (id: number) => {
    return unwrap<void>(axiosInstance.delete(`${API_ROUTES.MENU.ITEMS}/${id}`));
  },

  updateStock: (id: number, quantity: number) => {
    return unwrap<MenuItem>(axiosInstance.post(`${API_ROUTES.MENU.ITEMS}/${id}/stock`, { quantity }));
  },

  getLowStockItems: () => {
    return unwrap<MenuItem[]>(axiosInstance.get(`${API_ROUTES.MENU.ITEMS}/low-stock`));
  },

  createCategory: (data: Partial<MenuCategory>) => {
    return unwrap<MenuCategory>(axiosInstance.post(API_ROUTES.MENU.CATEGORIES, data));
  },

  toggleAvailability: (id: number) => {
    return unwrap<MenuItem>(axiosInstance.patch(`${API_ROUTES.MENU.ITEMS}/${id}/toggle-availability`));
  }
};
