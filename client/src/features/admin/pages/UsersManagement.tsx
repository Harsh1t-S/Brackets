import { useState } from "react";
import { ShieldCheck, Shield, Trash2, SearchX } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import { useAdminUsers, useSetUserRole } from "../hooks/useAdminUsers";
import { avatarDataUri } from "../../../lib/avatar";
import { useToast } from "../../../components/common/Toast";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useDebounce } from "../../../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import DeleteUserModal from "../components/DeleteUserModal";
import type { AdminUser } from "../services/adminUser.service";

const dateFmt: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data: users = [], isLoading, isError } = useAdminUsers(debouncedSearch);
  const setRole = useSetUserRole();
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const toast = useToast();
  useDocumentTitle("Users · Admin");

  return (
    <>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Users</h1>
          <p className="mt-1 text-ink-muted">Manage accounts and admin access.</p>
        </div>

        <div className="mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
          />
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading users...</div>
        ) : isError ? (
          <div className="card p-8 text-center text-hard">Failed to load users.</div>
        ) : users.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-ink-subtle">
              <SearchX size={24} />
            </span>
            <div>
              <h2 className="font-semibold text-ink">No users found</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {debouncedSearch
                  ? "No accounts match your search."
                  : "There are no users yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface-2 text-left text-xs uppercase tracking-wide text-ink-subtle">
                    <th className="px-6 py-3.5 font-semibold">Name</th>
                    <th className="px-6 py-3.5 font-semibold">Email</th>
                    <th className="px-6 py-3.5 font-semibold">Role</th>
                    <th className="px-6 py-3.5 font-semibold">Promoted by</th>
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
                          {isAdmin && u.promotedBy ? (
                            <span>
                              {u.promotedBy.name}
                              {u.promotedAt && (
                                <span className="block text-xs text-ink-subtle">
                                  {new Date(u.promotedAt).toLocaleDateString(
                                    undefined,
                                    dateFmt
                                  )}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-ink-subtle">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-ink-muted">
                          {new Date(u.createdAt).toLocaleDateString(
                            undefined,
                            dateFmt
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
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
                              {isAdmin ? (
                                <Shield size={14} />
                              ) : (
                                <ShieldCheck size={14} />
                              )}
                              {isAdmin ? "Revoke admin" : "Make admin"}
                            </button>
                            <button
                              disabled={isSelf}
                              onClick={() => setDeletingUser(u)}
                              title={
                                isSelf
                                  ? "You can't delete your own account"
                                  : "Delete user"
                              }
                              aria-label={`Delete ${u.name}`}
                              className="btn btn-secondary px-2.5 py-1.5 text-xs text-hard disabled:opacity-40"
                            >
                              <Trash2 size={14} />
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

      <DeleteUserModal
        open={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
      />
    </>
  );
}
