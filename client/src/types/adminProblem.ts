export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id?: string;
  input: string;
  output: string;
  isHidden: boolean;
}

export interface AdminProblem {
  id: string;
  number: number;

  title: string;
  slug: string;

  description: string;
  constraints?: string;

  difficulty: Difficulty;

  tags: string[];

  examples: Example[];

  starterCode: Record<string, string>;
  solutionCode: Record<string, string>;

  testCases?: TestCase[];

  premium: boolean;

  acceptance: number;
  likes: number;
  dislikes: number;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProblemDto {
  title: string;
  slug: string;

  description: string;
  constraints?: string;

  difficulty: Difficulty;

  tags: string[];

  examples: Example[];

  starterCode: Record<string, string>;
  solutionCode: Record<string, string>;

  testCases?: TestCase[];

  premium: boolean;
}

export interface AdminProblemsResponse {
  problems: AdminProblem[];
  total: number;
  page: number;
  totalPages: number;
}
