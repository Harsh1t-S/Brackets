import prisma from "../../prisma/prisma";

// Only what the dashboard cards need — never full rows (solutionCode!).
const problemSummary = {
  select: {
    id: true,
    number: true,
    title: true,
    slug: true,
    difficulty: true,
  },
} as const;

class DashboardService {
  async getDashboard(userId: string) {
    const [
      totalProblems,
      bookmarks,
      votesCast,
      solvedCount,
      recentBookmarks,
      recentSolved,
      totalsByDifficulty,
      solvedByDifficulty,
    ] = await Promise.all([
        prisma.problem.count(),

        prisma.bookmark.count({
          where: { userId },
        }),

        prisma.problemVote.count({
          where: { userId },
        }),

        prisma.solvedProblem.count({
          where: { userId },
        }),

        prisma.bookmark.findMany({
          where: { userId },
          include: { problem: problemSummary },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),

        prisma.solvedProblem.findMany({
          where: { userId },
          include: { problem: problemSummary },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),

        // Progress rings: how many exist vs how many this user solved.
        prisma.problem.groupBy({
          by: ["difficulty"],
          _count: { _all: true },
        }),

        prisma.solvedProblem.findMany({
          where: { userId },
          select: { problem: { select: { difficulty: true } } },
        }),
      ]);

    const emptyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };

    const totals = totalsByDifficulty.reduce(
      (acc, row) => ({ ...acc, [row.difficulty]: row._count._all }),
      { ...emptyCounts } as Record<string, number>
    );

    const solved = solvedByDifficulty.reduce(
      (acc, row) => ({
        ...acc,
        [row.problem.difficulty]: (acc[row.problem.difficulty] ?? 0) + 1,
      }),
      { ...emptyCounts } as Record<string, number>
    );

    return {
      totalProblems,
      bookmarks,
      votesCast,
      solvedCount,
      recentBookmarks,
      recentSolved,
      progress: { totals, solved },
    };
  }
}

export default new DashboardService();
