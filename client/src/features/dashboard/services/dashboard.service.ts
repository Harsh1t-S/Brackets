import api from "../../../lib/axios";

interface ProblemSummaryRow {
  id: string;
  createdAt: string;

  problem: {
    id: string;
    number: number;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
  };
}

export interface DashboardStats {
  totalProblems: number;
  bookmarks: number;
  votesCast: number;
  solvedCount: number;

  recentBookmarks: ProblemSummaryRow[];
  recentSolved: ProblemSummaryRow[];

  progress: {
    totals: Record<string, number>;
    solved: Record<string, number>;
  };
}

class DashboardService {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get("/dashboard");

    return response.data.data;
  }
}

export default new DashboardService();