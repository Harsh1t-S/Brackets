import prisma from "../../prisma/prisma";

class AdminDashboardService {
  async getDashboardStats() {
    const [
      totalProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      premiumProblems,
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

      prisma.problem.count({
        where: {
          premium: true,
        },
      }),

      prisma.user.count(),

      prisma.bookmark.count(),
    ]);

    return {
      totalProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      premiumProblems,
      totalUsers,
      totalBookmarks,
    };
  }
}

export default new AdminDashboardService();