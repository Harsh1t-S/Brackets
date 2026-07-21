import { useQuery } from "@tanstack/react-query";
import type { ProblemQuery } from "../../../services/problem.service";
import { getProblems, getFilterFacets } from "../../../services/problem.service";

export function useProblems(query: ProblemQuery) {
  return useQuery({
    queryKey: ["problems", query],
    queryFn: () => getProblems(query),
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