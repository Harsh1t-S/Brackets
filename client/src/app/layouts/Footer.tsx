import { Link } from "react-router-dom";
import Container from "./Container";
import Logo from "./Logo";
import { useAuth } from "../../features/auth/context/AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-line bg-surface">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo />
            <p className="text-sm text-ink-muted">
              Sharpen your coding skills, one problem at a time.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link to="/problems" className="transition-colors hover:text-ink">
              Problems
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="transition-colors hover:text-ink">
                  Dashboard
                </Link>
                <Link to="/bookmarks" className="transition-colors hover:text-ink">
                  Bookmarks
                </Link>
              </>
            ) : (
              <Link to="/login" className="transition-colors hover:text-ink">
                Sign in
              </Link>
            )}
          </nav>
        </div>

        <div className="border-t border-line py-6">
          <p className="text-center text-xs text-ink-subtle">
            © {new Date().getFullYear()} Bracket. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
