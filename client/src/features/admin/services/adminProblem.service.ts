import api from "../../../lib/axios";
import type {
  AdminProblem,
  AdminProblemsResponse,
  TestCase,
} from "../../../types/adminProblem";

export interface ProblemPayload {
  title: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  constraints?: string;
  examples: unknown;
  starterCode: unknown;
  solutionCode: unknown;
  testCases?: TestCase[];
  tags: string[];
  companies?: string[];
  acceptance: number;
}

export interface AdminProblemQuery {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  sort?: string;
}

class AdminProblemService {
  async getProblems(
    query: AdminProblemQuery = {}
  ): Promise<AdminProblemsResponse> {
    const { data } = await api.get("/admin/problems", { params: query });
    return data.data;
  }

  async getProblem(id: string): Promise<AdminProblem> {
    const { data } = await api.get(`/admin/problems/${id}`);
    return data.data;
  }

  async createProblem(payload: ProblemPayload): Promise<AdminProblem> {
    const { data } = await api.post("/admin/problems", payload);
    return data.data;
  }

  async updateProblem(
    id: string,
    payload: ProblemPayload
  ): Promise<AdminProblem> {
    const { data } = await api.put(`/admin/problems/${id}`, payload);
    return data.data;
  }

  async deleteProblem(id: string): Promise<void> {
    await api.delete(`/admin/problems/${id}`);
  }
}

const adminProblemService = new AdminProblemService();

export default adminProblemService;
