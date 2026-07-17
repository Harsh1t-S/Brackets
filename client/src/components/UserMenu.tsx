import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../features/auth/context/AuthContext";
import { avatarDataUri, getSavedAvatarHue } from "../lib/avatar";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { to: "/profile", label: "Profile", icon: User },
    ...(user?.role === "ADMIN"
      ? [{ to: "/admin", label: "Admin panel", icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2 py-1.5 pr-3 transition-colors hover:border-line-strong"
      >
        <img
          src={avatarDataUri(user?.name ?? "?", getSavedAvatarHue())}
          alt=""
          className="h-8 w-8 rounded-lg"
        />
        <span className="hidden text-sm font-medium text-ink md:block">
          {user?.name}
        </span>
        <ChevronDown size={16} className="text-ink-subtle" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-elevated shadow-xl shadow-black/20">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-subtle">{user?.email}</p>
          </div>
          <div className="p-1.5">
            {items.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-line p-1.5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-hard transition-colors hover:bg-hard/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
