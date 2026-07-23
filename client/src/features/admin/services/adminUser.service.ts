import api from "../../../lib/axios";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  /** Who granted admin, and when — null for seeded admins and plain users. */
  promotedBy: { id: string; name: string } | null;
  promotedAt: string | null;
  _count: { bookmarks: number };
}

export async function getUsers(search?: string): Promise<AdminUser[]> {
  const { data } = await api.get("/admin/users", {
    params: search ? { search } : undefined,
  });
  return data.data;
}

export async function setUserRole(id: string, role: "USER" | "ADMIN") {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  return data.data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data.data;
}
