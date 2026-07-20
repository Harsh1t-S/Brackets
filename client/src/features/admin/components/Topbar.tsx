import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { avatarDataUri } from "../../../lib/avatar";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Platform overview" },
  "/admin/problems": { title: "Problems", subtitle: "Manage the problem set" },
  "/admin/users": { title: "Users", subtitle: "Accounts and admin access" },
};

export default function Topbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { title, subtitle } =
    titles[pathname] ?? { title: "Admin", subtitle: "Bracket admin panel" };

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="text-sm text-ink-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-ink">{user?.name}</p>
          <p className="text-xs text-ink-subtle">{user?.email}</p>
        </div>
        <img
          src={user?.avatar || avatarDataUri(user?.name ?? "?")}
          alt=""
          className="h-9 w-9 rounded-lg object-cover"
        />
      </div>
    </header>
  );
}
