import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Logo from "./Logo";
import Container from "./Container";
import UserMenu from "../../components/UserMenu";

import { useAuth } from "../../features/auth/context/AuthContext";

const linkBase =
  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors";

function navClass({ isActive }: { isActive: boolean }) {
  return `${linkBase} ${
    isActive
      ? "bg-brand-soft text-brand"
      : "text-ink-muted hover:bg-surface-2 hover:text-ink"
  }`;
}

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Browsing lives on the left; "my stuff" sits on the right next to the
  // avatar, so personal pages read as part of the account area.
  const links = [
    { to: "/problems", label: "Problems" },
    ...(user ? [{ to: "/bookmarks", label: "Bookmarks" }] : []),
  ];

  const accountLinks = user ? [{ to: "/dashboard", label: "Dashboard" }] : [];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navClass}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              // Placeholder while the session resolves — avoids flashing
              // Login/Register at an already signed-in user.
              <div
                aria-hidden
                className="hidden h-9 w-28 animate-pulse rounded-xl bg-surface-2 sm:block"
              />
            ) : !user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className="btn btn-ghost px-4 py-2 text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary px-4 py-2 text-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-1 sm:flex">
                {accountLinks.map((l) => (
                  <NavLink key={l.to} to={l.to} className={navClass}>
                    {l.label}
                  </NavLink>
                ))}
                <UserMenu />
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="btn btn-ghost h-10 w-10 !p-0 rounded-lg md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-canvas md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-3">
              {[...links, ...accountLinks].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={navClass}
                >
                  {l.label}
                </NavLink>
              ))}
              {!user && (
                <div className="mt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-secondary flex-1 py-2 text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary flex-1 py-2 text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
              {user && (
                <div className="mt-2">
                  <UserMenu />
                </div>
              )}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
