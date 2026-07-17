import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import adminProblemService, {
  type AdminProblemQuery,
  type ProblemPayload,
} from "../services/adminProblem.service";

import type { AdminProblemsResponse } from "../../../types/adminProblem";

const QUERY_KEY = "admin-problems";

export const useAdminProblems = (query: AdminProblemQuery = {}) => {
  return useQuery<AdminProblemsResponse>({
    queryKey: [QUERY_KEY, query],
    queryFn: () => adminProblemService.getProblems(query),
    staleTime: 1000 * 30,
  });
};

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProblemPayload) =>
      adminProblemService.createProblem(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
    },
  });
};

export const useUpdateProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProblemPayload;
    }) => adminProblemService.updateProblem(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProblemService.deleteProblem(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
    },
  });
};
