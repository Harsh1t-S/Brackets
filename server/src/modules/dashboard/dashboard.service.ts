import prisma from "../../prisma/prisma";

class DashboardService {
  async getDashboard(userId: string) {
    const [totalProblems, bookmarks, votesCast, recentBookmarks] =
      await Promise.all([
        prisma.problem.count(),

        prisma.bookmark.count({
          where: { userId },
        }),

        prisma.problemVote.count({
          where: { userId },
        }),

        prisma.bookmark.findMany({
          where: { userId },
          include: { problem: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return {
      totalProblems,
      bookmarks,
      votesCast,
      recentBookmarks,
    };
  }
}

export default new DashboardService();