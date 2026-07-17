import { useEffect } from "react";

const BASE = "Bracket";

/** Sets the document title for the current route, restoring the base on unmount. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Bracket` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
