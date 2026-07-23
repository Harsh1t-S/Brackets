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
 * All users, newest first. An optional `search` narrows by name or email
 * (case-insensitive substring) so the admin list stays usable as it grows.
 */
export const getAllUsers = async (search?: string) => {
  const term = search?.trim();
  const where: Prisma.UserWhereInput = term
    ? {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { email: { contains: term, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });
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
  return prisma.user.delete({ where: { id } });
};
