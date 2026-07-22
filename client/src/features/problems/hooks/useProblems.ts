import { useQuery } from "@tanstack/react-query";
import type { ProblemQuery } from "../../../services/problem.service";
import {
  getProblems,
  getFilterFacets,
  getProblemContext,
} from "../../../services/problem.service";

export function useProblems(query: ProblemQuery) {
  // The cache key is the query object, so ["Array","Hash Map"] and
  // ["Hash Map","Array"] hashed to different entries and refetched the same
  // results. Order the list filters so selection order stops mattering.
  const normalized: ProblemQuery = {
    ...query,
    difficulties: [...(query.difficulties ?? [])].sort(),
    tags: [...(query.tags ?? [])].sort(),
    companies: [...(query.companies ?? [])].sort(),
  };

  return useQuery({
    queryKey: ["problems", normalized],
    queryFn: () => getProblems(normalized),
  });
}

/** Tag/company options for the filter panel — rarely changes. */
export function useFilterFacets() {
  return useQuery({
    queryKey: ["problem-filters"],
    queryFn: getFilterFacets,
    staleTime: 10 * 60_000,
  });
}

/** Previous/next neighbours and tag-related problems. */
export function useProblemContext(problemId?: string) {
  return useQuery({
    queryKey: ["problem-context", problemId],
    queryFn: () => getProblemContext(problemId as string),
    enabled: !!problemId,
    staleTime: 5 * 60_000,
  });
}