import api from "../../../lib/axios";

export interface DashboardStats {
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  premiumProblems: number;
  totalUsers: number;
  totalBookmarks: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get("/admin/dashboard/stats");
    return data.data;
  }
}

export default new DashboardService();