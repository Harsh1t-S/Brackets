import api from "../lib/axios";
import type { Problem } from "../types/problem";

export interface ProblemQuery {
  search?: string;
  /** Combinable filters — sent as comma-separated lists. */
  difficulties?: string[];
  tags?: string[];
  companies?: string[];
  match?: "all" | "any";
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface FilterFacet {
  value: string;
  count: number;
}

export interface FilterFacets {
  tags: FilterFacet[];
  companies: FilterFacet[];
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
  totalTopics: number;
}

export const getProblems = async ({
  search = "",
  difficulties = [],
  tags = [],
  companies = [],
  match = "any",
  status = "",
  sort = "",
  page = 1,
  limit = 10,
}: ProblemQuery): Promise<ProblemsResponse> => {
  const response = await api.get("/problems", {
    params: {
      search,
      // Omit empty lists so the URL stays clean.
      ...(difficulties.length && { difficulty: difficulties.join(",") }),
      ...(tags.length && { tags: tags.join(",") }),
      ...(companies.length && { companies: companies.join(",") }),
      ...(tags.length + companies.length > 1 && { match }),
      ...(status && { status }),
      sort,
      page,
      limit,
    },
  });

  return response.data.data;
};

export const getFilterFacets = async (): Promise<FilterFacets> => {
  const response = await api.get("/problems/filters");
  return response.data.data;
};

export interface ProblemSummary {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface ProblemContext {
  prev: ProblemSummary | null;
  next: ProblemSummary | null;
  related: ProblemSummary[];
}

export const getProblemContext = async (
  id: string
): Promise<ProblemContext> => {
  const response = await api.get(`/problems/${id}/context`);
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
