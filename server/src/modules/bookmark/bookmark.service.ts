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

export const getBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      problem: true,
    },
  });
};