import api from "../../../lib/axios";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: { bookmarks: number };
}

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await api.get("/admin/users");
  return data.data;
}

export async function setUserRole(id: string, role: "USER" | "ADMIN") {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role });
  return data.data;
}
