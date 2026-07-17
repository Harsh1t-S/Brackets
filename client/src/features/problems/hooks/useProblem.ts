import { useQuery } from "@tanstack/react-query";
import { getProblem } from "../../../services/problem.service";

/** `key` is a problem number ("1") or slug ("two-sum"). */
export function useProblem(key: string) {
  return useQuery({
    queryKey: ["problem", key],
    queryFn: () => getProblem(key),
    enabled: !!key,
  });
}