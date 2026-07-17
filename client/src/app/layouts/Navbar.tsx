import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/problems", label: "Problems" },
    ...(user
      ? [
          { to: "/bookmarks", label: "Bookmarks" },
          { to: "/dashboard", label: "Dashboard" },
        ]
      : []),
  ];

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
            {!user ? (
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
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              aria-label="Toggle menu"
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
        <div className="border-t border-line bg-canvas md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-3">
              {links.map((l) => (
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
