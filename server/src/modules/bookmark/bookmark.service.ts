import prisma from "../../prisma/prisma";

export const toggleBookmark = async (
  userId: string,
  problemId: string
) => {
  const existing = await prisma.bookmark.findFirst({
    where: {
      userId,
      problemId,
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: {
        id: existing.id,
      },
    });

    return { bookmarked: false };
  }

  await prisma.bookmark.create({
    data: {
      userId,
      problemId,
    },
  });

  return { bookmarked: true };
};

// Only the fields the bookmarks list renders — never the full row, which
// would ship solutionCode/starterCode to the client.
const bookmarkProblemSummary = {
  select: {
    id: true,
    number: true,
    title: true,
    slug: true,
    difficulty: true,
    tags: true,
  },
} as const;

export const getBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      problem: bookmarkProblemSummary,
    },
    orderBy: { createdAt: "desc" },
  });
};