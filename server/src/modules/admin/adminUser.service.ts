import prisma from "../../prisma/prisma";
import { Role } from "@prisma/client";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { bookmarks: true } },
    },
  });
};

export const setUserRole = async (id: string, role: Role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
};
