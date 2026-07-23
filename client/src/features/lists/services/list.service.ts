import api from "../../../lib/axios";

export type ListVisibility = "PRIVATE" | "PUBLIC";

export interface ProblemList {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  visibility: ListVisibility;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string };
  _count: { items: number };
}

export interface ListProblem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  acceptance: number;
  addedAt: string;
  solved: boolean;
}

export interface ProblemListDetail extends ProblemList {
  isOwner: boolean;
  items: ListProblem[];
}

/** A list summary plus whether it already holds the problem in question. */
export interface ListMembership {
  id: string;
  name: string;
  isDefault: boolean;
  contains: boolean;
}

export async function getMyLists(): Promise<ProblemList[]> {
  const { data } = await api.get("/lists/mine");
  return data.data;
}

export async function getList(slug: string): Promise<ProblemListDetail> {
  const { data } = await api.get(`/lists/${slug}`);
  return data.data;
}

export async function createList(input: {
  name: string;
  description?: string;
  visibility?: ListVisibility;
}): Promise<ProblemList> {
  const { data } = await api.post("/lists", input);
  return data.data;
}

export async function updateList(
  id: string,
  input: { name?: string; description?: string; visibility?: ListVisibility }
): Promise<ProblemList> {
  const { data } = await api.patch(`/lists/${id}`, input);
  return data.data;
}

export async function deleteList(id: string): Promise<{ id: string }> {
  const { data } = await api.delete(`/lists/${id}`);
  return data.data;
}

export async function addToList(listId: string, problemId: string) {
  const { data } = await api.post(`/lists/${listId}/items`, { problemId });
  return data.data;
}

export async function removeFromList(listId: string, problemId: string) {
  const { data } = await api.delete(`/lists/${listId}/items/${problemId}`);
  return data.data;
}

export async function getListsForProblem(
  problemId: string
): Promise<ListMembership[]> {
  const { data } = await api.get(`/lists/for-problem/${problemId}`);
  return data.data;
}

export async function toggleFavourite(
  problemId: string
): Promise<{ saved: boolean }> {
  const { data } = await api.post(`/lists/favourite/${problemId}`);
  return data.data;
}
