import { useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query. Uses useSyncExternalStore so there's no
 * set-state-in-effect and the first render already has the right value.
 *
 * @example const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    // Server snapshot (never hit in this SPA, but keeps the API honest).
    () => false
  );
}
