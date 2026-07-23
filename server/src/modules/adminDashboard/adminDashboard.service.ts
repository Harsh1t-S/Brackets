import prisma from "../../prisma/prisma";

class AdminDashboardService {
  async getDashboardStats() {
    const [
      totalProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      totalUsers,
      totalBookmarks,
    ] = await Promise.all([
      prisma.problem.count(),

      prisma.problem.count({
        where: {
          difficulty: "EASY",
        },
      }),

      prisma.problem.count({
        where: {
          difficulty: "MEDIUM",
        },
      }),

      prisma.problem.count({
        where: {
          difficulty: "HARD",
        },
      }),

      prisma.user.count(),

      // Saves live in lists now; the Bookmark table stopped growing.
      prisma.problemListItem.count(),
    ]);

    return {
      totalProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      totalUsers,
      totalBookmarks,
    };
  }
}

export default new AdminDashboardService();