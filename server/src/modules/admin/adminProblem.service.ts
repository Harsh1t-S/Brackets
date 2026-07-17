import { Difficulty, Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

export interface TestCaseInput {
  input: string;
  output: string;
  isHidden?: boolean;
}

export interface CreateProblemInput {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  constraints?: string;
  examples: Prisma.InputJsonValue;
  starterCode: Prisma.InputJsonValue;
  solutionCode: Prisma.InputJsonValue;
  tags: string[];
  companies?: string[];
  premium?: boolean;
  acceptance?: number;
  createdById?: string;
  testCases?: TestCaseInput[];
}

export interface UpdateProblemInput {
  title?: string;
  slug?: string;
  description?: string;
  difficulty?: Difficulty;
  constraints?: string;
  examples?: Prisma.InputJsonValue;
  starterCode?: Prisma.InputJsonValue;
  solutionCode?: Prisma.InputJsonValue;
  tags?: string[];
  companies?: string[];
  premium?: boolean;
  acceptance?: number;
  testCases?: TestCaseInput[];
}

export interface AdminProblemQuery {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
}

export class AdminProblemService {
  async getAllProblems({
    page = 1,
    limit = 10,
    search,
    difficulty,
  }: AdminProblemQuery = {}) {
    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { tags: { has: search } },
          { companies: { has: search } },
        ],
      }),
      ...(difficulty && {
        difficulty: difficulty as Difficulty,
      }),
    };

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { number: "asc" },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          testCases: { orderBy: { order: "asc" } },
        },
      }),
      prisma.problem.count({ where }),
    ]);

    return {
      problems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProblemById(id: string) {
    return prisma.problem.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        testCases: { orderBy: { order: "asc" } },
      },
    });
  }

  private async getNextNumber() {
    const last = await prisma.problem.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    return (last?.number ?? 0) + 1;
  }

  async createProblem(data: CreateProblemInput) {
    const existingProblem = await prisma.problem.findUnique({
      where: { slug: data.slug },
    });

    if (existingProblem) {
      throw new Error("SLUG_ALREADY_EXISTS");
    }

    const number = await this.getNextNumber();
    const testCases = data.testCases ?? [];

    return prisma.problem.create({
      data: {
        number,
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        constraints: data.constraints,
        examples: data.examples,
        starterCode: data.starterCode,
        solutionCode: data.solutionCode,
        tags: data.tags,
        companies: data.companies ?? [],
        premium: data.premium ?? false,
        acceptance: data.acceptance ?? 0,
        createdById: data.createdById,
        testCases: {
          create: testCases.map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden ?? false,
            order: idx,
          })),
        },
      },
      include: { testCases: true },
    });
  }

  async updateProblem(id: string, data: UpdateProblemInput) {
    if (data.slug) {
      const existingProblem = await prisma.problem.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });

      if (existingProblem) {
        throw new Error("SLUG_ALREADY_EXISTS");
      }
    }

    const { testCases, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      if (testCases) {
        await tx.testCase.deleteMany({ where: { problemId: id } });
      }

      return tx.problem.update({
        where: { id },
        data: {
          ...rest,
          ...(testCases && {
            testCases: {
              create: testCases.map((tc, idx) => ({
                input: tc.input,
                output: tc.output,
                isHidden: tc.isHidden ?? false,
                order: idx,
              })),
            },
          }),
        },
        include: { testCases: { orderBy: { order: "asc" } } },
      });
    });
  }

  async deleteProblem(id: string) {
    return prisma.problem.delete({
      where: { id },
    });
  }
}

export default new AdminProblemService();
