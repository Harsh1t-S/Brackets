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
    const [totalProblems, bookmarks, votesCast, solvedCount, recentBookmarks, recentSolved] =
      await Promise.all([
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
      ]);

    return {
      totalProblems,
      bookmarks,
      votesCast,
      solvedCount,
      recentBookmarks,
      recentSolved,
    };
  }
}

export default new DashboardService();
