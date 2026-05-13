import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api/menu';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => menuApi.getCategories(),
  });
};

export const useMenu = (categoryId?: number, search?: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ['menu', categoryId, search, page, size],
    queryFn: () => menuApi.getItems({ categoryId, search, page, size }),
  });
};

export const useMenuItem = (id: number) => {
  return useQuery({
    queryKey: ['menuItem', id],
    queryFn: () => menuApi.getItem(id),
    enabled: !!id,
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['lowStockItems'],
    queryFn: () => menuApi.getLowStockItems(),
  });
};
