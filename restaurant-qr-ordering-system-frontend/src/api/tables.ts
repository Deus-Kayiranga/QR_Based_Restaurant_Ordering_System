import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  RestaurantTable, 
  QRValidationRequest, 
  QRValidationResponse 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const tablesApi = {
  getTables: () => {
    return unwrap<RestaurantTable[]>(axiosInstance.get(API_ROUTES.TABLES.BASE));
  },
  
  getTable: (id: number) => {
    return unwrap<RestaurantTable>(axiosInstance.get(`${API_ROUTES.TABLES.BASE}/${id}`));
  },
  
  validateQR: (data: QRValidationRequest) => {
    return unwrap<QRValidationResponse>(axiosInstance.post(API_ROUTES.TABLES.VALIDATE, data));
  },

  createTable: (data: Partial<RestaurantTable>) => {
    return unwrap<RestaurantTable>(axiosInstance.post(API_ROUTES.TABLES.BASE, data));
  },

  updateTable: (id: number, data: Partial<RestaurantTable>) => {
    return unwrap<RestaurantTable>(axiosInstance.put(`${API_ROUTES.TABLES.BASE}/${id}`, data));
  },

  deleteTable: (id: number) => {
    return unwrap<void>(axiosInstance.delete(`${API_ROUTES.TABLES.BASE}/${id}`));
  },

  generateQr: (id: number) => {
    return unwrap<string>(axiosInstance.post(`${API_ROUTES.TABLES.BASE}/${id}/qr`));
  }
};
