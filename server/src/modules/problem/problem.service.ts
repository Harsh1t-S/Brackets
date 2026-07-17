import prisma from "../../prisma/prisma";

export const getProblems = async ({
  page = 1,
  limit = 10,
  search,
  difficulty,
  tag,
}: {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  tag?: string;
}) => {
  const where = {
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),

    ...(difficulty && {
      difficulty: difficulty as any,
    }),

    ...(tag && {
      tags: {
        has: tag,
      },
    }),
  };

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        number: "asc",
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

export const getMyVote = async (userId: string, problemId: string) => {
  const vote = await prisma.problemVote.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
  return vote?.value ?? 0;
};

export const getStats = async () => {
  const [total, easy, medium, hard, premium] = await Promise.all([
    prisma.problem.count(),
    prisma.problem.count({ where: { difficulty: "EASY" } }),
    prisma.problem.count({ where: { difficulty: "MEDIUM" } }),
    prisma.problem.count({ where: { difficulty: "HARD" } }),
    prisma.problem.count({ where: { premium: true } }),
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
    premiumProblems: premium,
    totalTopics: topics.size,
  };
};
