import api from "../../../lib/axios";
import type { Problem } from "../../../types/problem";

export interface BookmarkResponse {
  id: string;
  problem: Problem;
  createdAt: string;
}

class BookmarkService {
  async getBookmarks(): Promise<BookmarkResponse[]> {
    const response = await api.get("/bookmarks");

    return response.data.data;
  }

  async toggleBookmark(problemId: string) {
    const response = await api.post("/bookmarks", {
      problemId,
    });

    return response.data.data;
  }
}

export default new BookmarkService();