import { axiosInstance, unwrap } from './axiosInstance';
import type { 
  Notification, 
} from '../types';
import { API_ROUTES } from '../utils/constants';

export const notificationsApi = {
  getNotifications: () => {
    return unwrap<Notification[]>(axiosInstance.get(API_ROUTES.NOTIFICATIONS.BASE));
  },
  
  getUnreadCount: () => {
    return unwrap<number>(axiosInstance.get(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT));
  },

  markRead: (id: number) => {
    return unwrap<void>(axiosInstance.patch(`${API_ROUTES.NOTIFICATIONS.BASE}/${id}/read`));
  },

  markAllRead: () => {
    return unwrap<void>(axiosInstance.patch(`${API_ROUTES.NOTIFICATIONS.BASE}/read-all`));
  }
};
