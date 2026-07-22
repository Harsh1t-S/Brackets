import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../features/auth/context/AuthContext";
import { avatarDataUri, getSavedAvatarHue } from "../lib/avatar";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Dashboard and Bookmarks live in the top nav, so the dropdown holds only
  // account-specific destinations — no destination appears twice.
  const items = [
    { to: "/profile", label: "Profile", icon: User },
    ...(user?.role === "ADMIN"
      ? [{ to: "/admin", label: "Admin panel", icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user?.name ?? "your account"}`}
        className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2 py-1.5 pr-3 transition-colors hover:border-line-strong"
      >
        <img
          src={user?.avatar || avatarDataUri(user?.name ?? "?", getSavedAvatarHue())}
          alt=""
          className="h-8 w-8 rounded-lg object-cover"
        />
        <span className="hidden text-sm font-medium text-ink md:block">
          {user?.name}
        </span>
        <ChevronDown size={16} className="text-ink-subtle" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-elevated shadow-xl shadow-black/20"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-subtle">{user?.email}</p>
          </div>
          <div className="p-1.5">
            {items.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
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
              role="menuitem"
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
