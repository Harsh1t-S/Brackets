import { useQuery } from "@tanstack/react-query";
import type { ProblemQuery } from "../../../services/problem.service";
import{  getProblems
} from "../../../services/problem.service";

export function useProblems(query: ProblemQuery) {
  return useQuery({
    queryKey: ["problems", query],
    queryFn: () => getProblems(query),
  });
}