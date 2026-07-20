import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios";

async function fetchMySolved(problemId: string): Promise<boolean> {
  const { data } = await api.get(`/problems/${problemId}/solved`);
  return data.data.solved;
}

async function toggleSolved(problemId: string): Promise<{ solved: boolean }> {
  const { data } = await api.post(`/problems/${problemId}/solved`);
  return data.data;
}

export function useMySolved(problemId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["problem-solved", problemId],
    queryFn: () => fetchMySolved(problemId),
    enabled,
  });
}

export function useToggleSolved(problemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleSolved(problemId),
    onSuccess: (result) => {
      queryClient.setQueryData(["problem-solved", problemId], result.solved);
      // Solved counts/lists live on the dashboard payload.
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
