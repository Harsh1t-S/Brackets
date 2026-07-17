import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/axios";

interface VoteResult {
  likes: number;
  dislikes: number;
  myVote: number; // 1, -1, or 0
}

async function fetchMyVote(problemId: string): Promise<number> {
  const { data } = await api.get(`/problems/${problemId}/vote`);
  return data.data.value;
}

async function sendVote(problemId: string, value: 1 | -1): Promise<VoteResult> {
  const { data } = await api.post(`/problems/${problemId}/vote`, { value });
  return data.data;
}

export function useMyVote(problemId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["problem-vote", problemId],
    queryFn: () => fetchMyVote(problemId),
    enabled,
  });
}

export function useVote(problemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: 1 | -1) => sendVote(problemId, value),
    onSuccess: (result) => {
      queryClient.setQueryData(["problem-vote", problemId], result.myVote);
      // Detail pages may be cached under number or slug — match by id.
      queryClient.setQueriesData({ queryKey: ["problem"] }, (old: any) =>
        old?.id === problemId
          ? { ...old, likes: result.likes, dislikes: result.dislikes }
          : old
      );
    },
  });
}
