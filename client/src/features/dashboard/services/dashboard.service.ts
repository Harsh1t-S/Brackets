import api from "../../../lib/axios";

export interface DashboardStats {
  totalProblems: number;
  bookmarks: number;
  votesCast: number;

  recentBookmarks: {
    id: string;
    createdAt: string;

    problem: {
      id: string;
      number: number;
      title: string;
      slug: string;
      difficulty: "EASY" | "MEDIUM" | "HARD";
    };
  }[];
}

class DashboardService {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get("/dashboard");

    return response.data.data;
  }
}

export default new DashboardService();