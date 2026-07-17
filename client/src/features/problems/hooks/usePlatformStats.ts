import { useQuery } from "@tanstack/react-query";
import { getStats } from "../../../services/problem.service";

export function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,
  });
}
