import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export type Todo = { id: number; title: string; completed: boolean };

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await api.get<Todo[]>('/todos');
      return data;
    },
  });
}
