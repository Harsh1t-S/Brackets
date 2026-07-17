import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import bookmarkService,{ type BookmarkResponse } from "../services/bookmark.service";

const QUERY_KEY = ["bookmarks"];

export function useBookmarks() {
  return useQuery<BookmarkResponse[]>({
    queryKey: QUERY_KEY,
    queryFn: () => bookmarkService.getBookmarks(),
    initialData: [],
    // Don't fire (and 401) for signed-out visitors.
    enabled: !!localStorage.getItem("token"),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (problemId: string) =>
      bookmarkService.toggleBookmark(problemId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}