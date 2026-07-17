export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;

  description: string;
  constraints?: string;

  difficulty: "EASY" | "MEDIUM" | "HARD";

  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];

  starterCode: Record<string, string>;
  solutionCode: Record<string, string>;

  tags: string[];
  companies?: string[];

  acceptance: number;
  likes: number;
  dislikes: number;
  premium: boolean;

  createdAt: string;
  updatedAt: string;
}
