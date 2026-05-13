import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '../types';

export interface AuditLog {
  logId: number;
  action: string;
  module: string;
  details: string;
  performedBy: string;
  userRole: string;
  timestamp: string;
}

export const auditApi = {
  getLogs: () => axiosInstance.get<ApiResponse<AuditLog[]>>('/api/audit/logs').then(res => res.data.data),
};
