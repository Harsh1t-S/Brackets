import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position on navigation — but not when the URL carries a hash
 * (let the browser jump to the anchored element) so in-page links keep working.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
