import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import { avatarDataUri } from "../../../lib/avatar";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function ProfilePage() {
  useDocumentTitle("Profile");
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Profile</h1>
      <p className="mt-2 text-ink-muted">Your account details.</p>

      <div className="card mt-8 p-8">
        <div className="flex items-center gap-4">
          <img
            src={avatarDataUri(user?.name ?? "?")}
            alt=""
            className="h-16 w-16 rounded-2xl"
          />
          <div>
            <h2 className="text-xl font-semibold text-ink">{user?.name}</h2>
            <p className="text-sm text-ink-muted">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <Mail size={14} /> Email
            </p>
            <p className="mt-1.5 font-medium text-ink">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-center gap-2 text-xs text-ink-subtle">
              <ShieldCheck size={14} /> Role
            </p>
            <p className="mt-1.5 font-medium text-ink">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
