import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);

// Whitelisted sort orders — never interpolate user input into ORDER BY.
const SORTS: Record<string, Prisma.Sql> = {
  number: Prisma.raw(`"number" ASC`),
  acceptance: Prisma.raw(`"acceptance" DESC`),
  likes: Prisma.raw(`"likes" DESC`),
  newest: Prisma.raw(`"createdAt" DESC`),
};

export const getProblems = async ({
  page = 1,
  limit = 10,
  search,
  difficulty,
  tag,
  sort,
}: {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  tag?: string;
  sort?: string;
}) => {
  const skip = (page - 1) * limit;
  const orderBy = SORTS[sort ?? "number"] ?? SORTS.number;
  const filters: Prisma.Sql[] = [];

  const term = search?.trim();
  if (term) {
    // Match the term against the title, any tag, or any company — all
    // case-insensitive and partial (ILIKE).
    const like = `%${term}%`;
    filters.push(Prisma.sql`(
      "title" ILIKE ${like}
      OR EXISTS (SELECT 1 FROM unnest("tags") AS tg WHERE tg ILIKE ${like})
      OR EXISTS (SELECT 1 FROM unnest("companies") AS co WHERE co ILIKE ${like})
    )`);
  }

  if (difficulty && DIFFICULTIES.has(difficulty)) {
    filters.push(Prisma.sql`"difficulty" = ${difficulty}::"Difficulty"`);
  }

  if (tag) {
    filters.push(Prisma.sql`${tag} = ANY("tags")`);
  }

  const whereSql = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  const [problems, countRows] = await Promise.all([
    // Explicit column list: the public list must never ship solutionCode
    // (or starterCode — the editor loads it from the detail endpoint).
    prisma.$queryRaw`
      SELECT "id", "number", "title", "slug", "difficulty", "tags",
             "companies", "acceptance", "likes", "dislikes",
             "createdAt", "updatedAt"
      FROM "Problem"
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${skip}
    `,
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "Problem"
      ${whereSql}
    `,
  ]);

  const total = Number(countRows[0]?.count ?? 0);

  return {
    problems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/** Fetch by problem number ("1") or slug ("two-sum"). */
export const getProblem = async (key: string) => {
  if (/^\d+$/.test(key)) {
    return prisma.problem.findUnique({
      where: { number: Number(key) },
    });
  }
  return prisma.problem.findUnique({
    where: { slug: key },
  });
};

export const setVote = async (
  userId: string,
  problemId: string,
  value: 1 | -1
) => {
  const existing = await prisma.problemVote.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  const old = existing?.value ?? 0;
  // Clicking the same reaction again clears it (toggle), like LeetCode.
  const next = old === value ? 0 : value;

  const likesDelta = (next === 1 ? 1 : 0) - (old === 1 ? 1 : 0);
  const dislikesDelta = (next === -1 ? 1 : 0) - (old === -1 ? 1 : 0);

  const [problem] = await prisma.$transaction([
    prisma.problem.update({
      where: { id: problemId },
      data: {
        likes: { increment: likesDelta },
        dislikes: { increment: dislikesDelta },
      },
      select: { likes: true, dislikes: true },
    }),
    next === 0
      ? prisma.problemVote.delete({
          where: { userId_problemId: { userId, problemId } },
        })
      : prisma.problemVote.upsert({
          where: { userId_problemId: { userId, problemId } },
          update: { value: next },
          create: { userId, problemId, value: next },
        }),
  ]);

  return { likes: problem.likes, dislikes: problem.dislikes, myVote: next };
};

export const toggleSolved = async (userId: string, problemId: string) => {
  const existing = await prisma.solvedProblem.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (existing) {
    await prisma.solvedProblem.delete({ where: { id: existing.id } });
    return { solved: false };
  }

  await prisma.solvedProblem.create({ data: { userId, problemId } });
  return { solved: true };
};

export const getMySolved = async (userId: string, problemId: string) => {
  const row = await prisma.solvedProblem.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
  return !!row;
};

export const getMyVote = async (userId: string, problemId: string) => {
  const vote = await prisma.problemVote.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
  return vote?.value ?? 0;
};

export const getStats = async () => {
  const [total, easy, medium, hard] = await Promise.all([
    prisma.problem.count(),
    prisma.problem.count({ where: { difficulty: "EASY" } }),
    prisma.problem.count({ where: { difficulty: "MEDIUM" } }),
    prisma.problem.count({ where: { difficulty: "HARD" } }),
  ]);

  // Distinct tags across all problems.
  const tagRows = await prisma.problem.findMany({ select: { tags: true } });
  const topics = new Set<string>();
  tagRows.forEach((row) => row.tags.forEach((t) => topics.add(t)));

  return {
    totalProblems: total,
    easyProblems: easy,
    mediumProblems: medium,
    hardProblems: hard,
    totalTopics: topics.size,
  };
};
