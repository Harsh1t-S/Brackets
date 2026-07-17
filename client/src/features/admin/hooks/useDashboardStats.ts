import { useQuery } from "@tanstack/react-query";

import dashboardService from "../services/dashboard.service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5,
  });
};