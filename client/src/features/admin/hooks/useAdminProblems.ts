import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import adminProblemService, {
  type AdminProblemQuery,
  type ProblemPayload,
} from "../services/adminProblem.service";

import type { AdminProblemsResponse } from "../../../types/adminProblem";

const QUERY_KEY = "admin-problems";

/**
 * Admin writes change the same rows the public pages read, so the public
 * caches have to drop too — otherwise an edited title keeps showing the old
 * value on /problems until the cache ages out or the tab is reloaded.
 */
function invalidateProblemViews(queryClient: QueryClient) {
  for (const key of [
    [QUERY_KEY],
    ["platform-stats"],
    ["problems"],
    ["problem"],
    ["problem-filters"],
  ]) {
    queryClient.invalidateQueries({ queryKey: key });
  }
}

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

    onSuccess: () => invalidateProblemViews(queryClient),
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

    onSuccess: () => invalidateProblemViews(queryClient),
  });
};

export const useDeleteProblem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProblemService.deleteProblem(id),

    onSuccess: () => invalidateProblemViews(queryClient),
  });
};
