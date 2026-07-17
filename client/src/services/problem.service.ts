import api from "../lib/axios";
import type { Problem } from "../types/problem";

export interface ProblemQuery {
  search?: string;
  difficulty?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface ProblemsResponse {
  problems: Problem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PlatformStats {
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  premiumProblems: number;
  totalTopics: number;
}

export const getProblems = async ({
  search = "",
  difficulty = "",
  tag = "",
  page = 1,
  limit = 10,
}: ProblemQuery): Promise<ProblemsResponse> => {
  const response = await api.get("/problems", {
    params: {
      search,
      difficulty,
      tag,
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getStats = async (): Promise<PlatformStats> => {
  const response = await api.get("/problems/stats");
  return response.data.data;
};

export const getProblem = async (slug: string): Promise<Problem> => {
  const response = await api.get(`/problems/${slug}`);
  return response.data.data;
};
