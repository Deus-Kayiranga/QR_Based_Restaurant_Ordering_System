import { axiosInstance, unwrap } from './axiosInstance';
import type { User } from '../types';

export interface SectionAssignment {
  assignmentId: number;
  sectionName: string;
  waiter: User;
  isActive: boolean;
  createdAt: string;
}

export const sectionsApi = {
  getAll: () => {
    return unwrap<SectionAssignment[]>(axiosInstance.get('/sections/'));
  },
  
  assign: (sectionName: string, waiterId: number) => {
    return unwrap<SectionAssignment>(axiosInstance.post('/sections/assign', null, {
      params: { sectionName, waiterId }
    }));
  },

  remove: (id: number) => {
    return unwrap<void>(axiosInstance.delete(`/sections/${id}`));
  }
};
