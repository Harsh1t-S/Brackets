import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as service from "../services/list.service";
import type { ListVisibility } from "../services/list.service";

const LISTS = "lists";

/**
 * Everything a list write can invalidate. Membership drives the save button's
 * filled state on every problem page, so it goes stale on any add/remove.
 */
function invalidateLists(queryClient: ReturnType<typeof useQueryClient>) {
  for (const key of [[LISTS], ["list"], ["list-membership"], ["dashboard"]]) {
    queryClient.invalidateQueries({ queryKey: key });
  }
}

export function useMyLists(enabled = true) {
  return useQuery({
    queryKey: [LISTS],
    queryFn: service.getMyLists,
    enabled,
  });
}

export function useList(slug: string | undefined) {
  return useQuery({
    queryKey: ["list", slug],
    queryFn: () => service.getList(slug as string),
    enabled: !!slug,
  });
}

export function useListsForProblem(problemId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["list-membership", problemId],
    queryFn: () => service.getListsForProblem(problemId),
    enabled,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: service.createList,
    onSuccess: () => invalidateLists(queryClient),
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      name?: string;
      description?: string;
      visibility?: ListVisibility;
    }) => service.updateList(id, input),
    onSuccess: () => invalidateLists(queryClient),
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: service.deleteList,
    onSuccess: () => invalidateLists(queryClient),
  });
}

export function useToggleListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      listId,
      problemId,
      contains,
    }: {
      listId: string;
      problemId: string;
      contains: boolean;
    }) =>
      contains
        ? service.removeFromList(listId, problemId)
        : service.addToList(listId, problemId),
    onSuccess: () => invalidateLists(queryClient),
  });
}

/** The one-click save button — writes to the built-in Favourites list. */
export function useToggleFavourite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (problemId: string) => service.toggleFavourite(problemId),
    onSuccess: () => invalidateLists(queryClient),
  });
}
