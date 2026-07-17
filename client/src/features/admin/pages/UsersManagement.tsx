import { ShieldCheck, Shield } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import { useAdminUsers, useSetUserRole } from "../hooks/useAdminUsers";
import { avatarDataUri } from "../../../lib/avatar";
import { useToast } from "../../../components/common/Toast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading, isError } = useAdminUsers();
  const setRole = useSetUserRole();
  const toast = useToast();
  useDocumentTitle("Users · Admin");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Users</h1>
        <p className="mt-1 text-ink-muted">Manage accounts and admin access.</p>
      </div>

      {isLoading ? (
        <div className="card p-8 text-center text-ink-muted">Loading users...</div>
      ) : isError ? (
        <div className="card p-8 text-center text-hard">Failed to load users.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-left text-xs uppercase tracking-wide text-ink-subtle">
                  <th className="px-6 py-3.5 font-semibold">Name</th>
                  <th className="px-6 py-3.5 font-semibold">Email</th>
                  <th className="px-6 py-3.5 font-semibold">Role</th>
                  <th className="px-6 py-3.5 font-semibold">Joined</th>
                  <th className="px-6 py-3.5 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const isAdmin = u.role === "ADMIN";
                  return (
                    <tr key={u.id} className="transition-colors hover:bg-surface-2">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarDataUri(u.name)}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-lg"
                          />
                          <span className="font-medium text-ink">
                            {u.name}
                            {isSelf && (
                              <span className="ml-2 text-xs text-ink-subtle">
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-muted">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            isAdmin
                              ? "badge bg-brand-soft text-brand"
                              : "badge bg-surface-2 text-ink-muted"
                          }
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-ink-muted">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            disabled={setRole.isPending || (isSelf && isAdmin)}
                            onClick={() =>
                              setRole.mutate(
                                {
                                  id: u.id,
                                  role: isAdmin ? "USER" : "ADMIN",
                                },
                                {
                                  onSuccess: () =>
                                    toast(
                                      isAdmin
                                        ? `${u.name} is no longer an admin`
                                        : `${u.name} is now an admin`,
                                      "success"
                                    ),
                                  onError: () =>
                                    toast("Couldn't update role", "error"),
                                }
                              )
                            }
                            title={
                              isSelf && isAdmin
                                ? "You can't remove your own admin access"
                                : undefined
                            }
                            className="btn btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
                          >
                            {isAdmin ? <Shield size={14} /> : <ShieldCheck size={14} />}
                            {isAdmin ? "Revoke admin" : "Make admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
