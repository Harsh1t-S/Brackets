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

  /** Seeded, not measured — see solvedCount for a figure backed by real rows. */
  acceptance: number;
  /** Distinct users who have marked this solved. */
  solvedCount: number;
  likes: number;
  dislikes: number;

  createdAt: string;
  updatedAt: string;
}
