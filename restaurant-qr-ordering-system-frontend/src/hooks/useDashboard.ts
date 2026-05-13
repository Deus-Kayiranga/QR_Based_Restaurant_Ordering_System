import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../api/staff';

export const useManagerDashboard = () => {
  return useQuery({
    queryKey: ['managerDashboard'],
    queryFn: () => staffApi.getManagerDashboard(),
    refetchInterval: 30000,
  });
};
