import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Spinner } from "../../components/common/Spinner";

function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center gap-3 bg-canvas text-ink-muted"
    >
      <Spinner size={24} />
      <span className="text-sm">Loading…</span>
    </div>
  );
}

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

/** Auth pages: already-signed-in users get bounced home. */
export function GuestOnly() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}

export function RequireAdmin() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet />;
}
