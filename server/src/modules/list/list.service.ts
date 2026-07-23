import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { ApiError } from "../../utils/ApiError";

export const DEFAULT_LIST_NAME = "Favourites";

/** Problem fields a list needs to render a row — never solutionCode. */
const problemSummary = {
  id: true,
  number: true,
  title: true,
  slug: true,
  difficulty: true,
  tags: true,
  acceptance: true,
} satisfies Prisma.ProblemSelect;

const listSelect = {
  id: true,
  name: true,
  description: true,
  slug: true,
  visibility: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true } },
  _count: { select: { items: true } },
} satisfies Prisma.ProblemListSelect;

/**
 * URL-safe slug with a random suffix.
 *
 * The suffix keeps public list URLs from being guessable by name alone — two
 * users can both have "Interview prep" without colliding, and nobody can
 * enumerate other people's lists by trying obvious slugs.
 */
function makeSlug(name: string): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40) || "list";

  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

/**
 * The user's Favourites list, created on first use.
 *
 * Bookmarking has to keep working for accounts that predate lists, so this is
 * lazily provisioned rather than backfilled at signup.
 */
export const getOrCreateDefaultList = async (userId: string) => {
  const existing = await prisma.problemList.findFirst({
    where: { userId, isDefault: true },
    select: { id: true },
  });
  if (existing) return existing;

  try {
    return await prisma.problemList.create({
      data: {
        userId,
        name: DEFAULT_LIST_NAME,
        slug: makeSlug(DEFAULT_LIST_NAME),
        isDefault: true,
      },
      select: { id: true },
    });
  } catch (error) {
    // Two concurrent bookmarks can race here; the unique([userId, name])
    // constraint settles it, and the loser just reads the winner's row.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const list = await prisma.problemList.findFirst({
        where: { userId, isDefault: true },
        select: { id: true },
      });
      if (list) return list;
    }
    throw error;
  }
};

export const getMyLists = async (userId: string) => {
  await getOrCreateDefaultList(userId);
  return prisma.problemList.findMany({
    where: { userId },
    // Favourites always sits at the top; everything else newest first.
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: listSelect,
  });
};

/**
 * A single list with its problems.
 *
 * `viewerId` is the signed-in user or undefined. A private list is visible
 * only to its owner; a public one to anyone with the slug.
 */
export const getList = async (slug: string, viewerId?: string) => {
  const list = await prisma.problemList.findUnique({
    where: { slug },
    select: {
      ...listSelect,
      items: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: {
          position: true,
          createdAt: true,
          problem: { select: problemSummary },
        },
      },
    },
  });

  if (!list) throw new ApiError(404, "List not found.");

  const isOwner = !!viewerId && list.user.id === viewerId;
  if (list.visibility === "PRIVATE" && !isOwner) {
    // 404 rather than 403: a private list shouldn't confirm it exists.
    throw new ApiError(404, "List not found.");
  }

  const solved = viewerId
    ? await prisma.solvedProblem.findMany({
        where: {
          userId: viewerId,
          problemId: { in: list.items.map((i) => i.problem.id) },
        },
        select: { problemId: true },
      })
    : [];
  const solvedIds = new Set(solved.map((s) => s.problemId));

  return {
    ...list,
    isOwner,
    items: list.items.map((item) => ({
      ...item.problem,
      addedAt: item.createdAt,
      solved: solvedIds.has(item.problem.id),
    })),
  };
};

export const createList = async (
  userId: string,
  input: { name: string; description?: string; visibility?: "PRIVATE" | "PUBLIC" }
) => {
  try {
    return await prisma.problemList.create({
      data: {
        userId,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        visibility: input.visibility ?? "PRIVATE",
        slug: makeSlug(input.name),
      },
      select: listSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "You already have a list with that name.");
    }
    throw error;
  }
};

/** Load a list the caller owns, or fail. Used by every mutating path. */
const ownedList = async (listId: string, userId: string) => {
  const list = await prisma.problemList.findUnique({
    where: { id: listId },
    select: { id: true, userId: true, isDefault: true },
  });
  if (!list || list.userId !== userId) throw new ApiError(404, "List not found.");
  return list;
};

export const updateList = async (
  listId: string,
  userId: string,
  input: { name?: string; description?: string; visibility?: "PRIVATE" | "PUBLIC" }
) => {
  const list = await ownedList(listId, userId);

  // Renaming Favourites would break the "one default per user" name
  // constraint and the meaning of the flag; its visibility is still free.
  if (list.isDefault && input.name && input.name.trim() !== DEFAULT_LIST_NAME) {
    throw new ApiError(400, "The Favourites list can't be renamed.");
  }

  try {
    return await prisma.problemList.update({
      where: { id: listId },
      data: {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.description !== undefined && {
          description: input.description.trim() || null,
        }),
        ...(input.visibility !== undefined && { visibility: input.visibility }),
      },
      select: listSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "You already have a list with that name.");
    }
    throw error;
  }
};

export const deleteList = async (listId: string, userId: string) => {
  const list = await ownedList(listId, userId);
  if (list.isDefault) {
    throw new ApiError(400, "The Favourites list can't be deleted.");
  }
  await prisma.problemList.delete({ where: { id: listId } });
  return { id: listId };
};

export const addProblem = async (
  listId: string,
  userId: string,
  problemId: string
) => {
  await ownedList(listId, userId);

  const last = await prisma.problemListItem.findFirst({
    where: { listId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  try {
    await prisma.problemListItem.create({
      data: { listId, problemId, position: (last?.position ?? -1) + 1 },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Already in the list — adding twice is a no-op, not an error.
      if (error.code === "P2002") return { listId, problemId, added: true };
      if (error.code === "P2003") throw new ApiError(404, "Problem not found.");
    }
    throw error;
  }

  return { listId, problemId, added: true };
};

export const removeProblem = async (
  listId: string,
  userId: string,
  problemId: string
) => {
  await ownedList(listId, userId);
  await prisma.problemListItem.deleteMany({ where: { listId, problemId } });
  return { listId, problemId, added: false };
};

/**
 * Which of the caller's lists contain a problem — drives the "Save to list"
 * picker and the filled/empty state of the bookmark button.
 */
export const getListsForProblem = async (userId: string, problemId: string) => {
  await getOrCreateDefaultList(userId);
  const lists = await prisma.problemList.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      isDefault: true,
      items: { where: { problemId }, select: { id: true } },
    },
  });

  return lists.map(({ items, ...list }) => ({
    ...list,
    contains: items.length > 0,
  }));
};

/** Toggle a problem in the default list — what the bookmark button calls. */
export const toggleFavourite = async (userId: string, problemId: string) => {
  const list = await getOrCreateDefaultList(userId);
  const existing = await prisma.problemListItem.findUnique({
    where: { listId_problemId: { listId: list.id, problemId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.problemListItem.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await addProblem(list.id, userId, problemId);
  return { saved: true };
};
