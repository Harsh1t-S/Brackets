import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, FileCode, Users, Braces, ArrowLeft } from "lucide-react";

const links = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Problems", path: "/admin/problems", icon: FileCode },
  { name: "Users", path: "/admin/users", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex">
      <div className="flex items-center gap-2.5 border-b border-line px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-on-brand">
          <Braces size={18} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-sm font-bold tracking-tight text-gradient">
            Bracket
          </h1>
          <p className="text-xs text-ink-subtle">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-soft text-brand"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <ArrowLeft size={18} />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
