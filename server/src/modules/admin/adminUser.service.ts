import prisma from "../../prisma/prisma";
import { Prisma, Role } from "@prisma/client";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  promotedAt: true,
  // Who granted this user admin — null for seeded admins or plain users.
  promotedBy: { select: { id: true, name: true } },
  _count: { select: { bookmarks: true } },
} satisfies Prisma.UserSelect;

/**
 * A page of users, newest first. An optional `search` narrows by name or
 * email (case-insensitive substring) so the admin list stays usable as it
 * grows.
 *
 * Paginated because this returns every user's email address in one response —
 * fine at six users, a slow and needlessly revealing payload at six thousand.
 */
export const getAllUsers = async ({
  search,
  page = 1,
  limit = 25,
}: { search?: string; page?: number; limit?: number } = {}) => {
  const term = search?.trim();
  const where: Prisma.UserWhereInput = term
    ? {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: userSelect,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * Flip a user's role. Promoting to ADMIN stamps who did it and when;
 * demoting to USER clears that audit trail so a stale promoter never lingers
 * on a plain account. `actorId` is the admin performing the change.
 */
export const setUserRole = async (id: string, role: Role, actorId: string) => {
  const data: Prisma.UserUpdateInput =
    role === "ADMIN"
      ? {
          role,
          promotedAt: new Date(),
          promotedBy: { connect: { id: actorId } },
        }
      : {
          role,
          promotedAt: null,
          promotedBy: { disconnect: true },
        };

  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};

export const deleteUser = async (id: string) => {
  // Cascades clear the user's bookmarks/votes/solved rows; authored problems
  // and any promotions they granted are detached (createdById / promotedById
  // set null) rather than deleted.
  //
  // The vote cascade needs help: like/dislike totals are denormalised onto
  // Problem, so dropping a voter's rows without adjusting the counters leaves
  // every problem they ever voted on permanently inflated, with no way to
  // tell later. Roll their votes back first, in the same transaction.
  return prisma.$transaction(async (tx) => {
    const votes = await tx.problemVote.findMany({
      where: { userId: id },
      select: { problemId: true, value: true },
    });

    for (const vote of votes) {
      if (vote.value !== 1 && vote.value !== -1) continue;
      await tx.problem.update({
        where: { id: vote.problemId },
        data:
          vote.value === 1
            ? { likes: { decrement: 1 } }
            : { dislikes: { decrement: 1 } },
      });
    }

    return tx.user.delete({ where: { id } });
  });
};
