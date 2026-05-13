import { useQuery } from '@tanstack/react-query';
import { tablesApi } from '../api/tables';

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesApi.getTables(),
    refetchInterval: 15000,
  });
};

export const useTableStatus = (tableId: number) => {
  return useQuery({
    queryKey: ['tableStatus', tableId],
    queryFn: () => tablesApi.getTable(tableId),
    refetchInterval: 10000,
    enabled: !!tableId,
  });
};
