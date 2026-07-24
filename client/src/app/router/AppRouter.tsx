import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { RequireAuth, RequireAdmin, GuestOnly } from "./ProtectedRoute";
import { Spinner } from "../../components/common/Spinner";

import HomePage from "../../features/home/HomePage";
import ProblemsPage from "../../features/problems/pages/ProblemsPage";
import ProblemDetailsPage from "../../features/problems/pages/ProblemDetailsPage";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import ListsPage from "../../features/lists/pages/ListsPage";
import ListDetailPage from "../../features/lists/pages/ListDetailPage";

// The admin panel (incl. the Quill editor) is code-split out of the main
// bundle — regular visitors never download it.
const AdminLayout = lazy(() => import("../../features/admin/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../../features/admin/pages/AdminDashboard"));
const ProblemsManagement = lazy(() => import("../../features/admin/pages/ProblemsManagement"));
const UsersManagement = lazy(() => import("../../features/admin/pages/UsersManagement"));
import NotFoundPage from "../../components/common/NotFoundPage";
import ScrollToTop from "../../components/common/ScrollToTop";

// A bare "/5" jumps to problem #5. Static routes (/login, /problems, …) rank
// higher than this dynamic segment, so only unmatched single-segment paths
// land here; non-numeric ones fall through to the 404.
function ProblemShortcut() {
  const { key = "" } = useParams();
  if (/^\d+$/.test(key)) {
    return <Navigate to={`/problems/${key}`} replace />;
  }
  return <NotFoundPage />;
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="flex h-screen items-center justify-center gap-3 bg-canvas text-ink-muted"
          >
            <Spinner size={24} />
            <span className="text-sm">Loading…</span>
          </div>
        }
      >
      <Routes>
      {/* Marketing + app pages (with site navbar/footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/lists/:slug" element={<ListDetailPage />} />
        <Route path="/:key" element={<ProblemShortcut />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lists" element={<ListsPage />} />
          {/* Bookmarks became the built-in Favourites list; keep old
              links working rather than 404ing them. */}
          <Route path="/bookmarks" element={<Navigate to="/lists" replace />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Solve view: full-screen workspace with its own slim bar — no site
          navbar/footer so the panels own the whole viewport. Opening a problem
          requires an account; RequireAuth bounces guests to login and brings
          them back here afterwards. */}
      <Route element={<RequireAuth />}>
        <Route path="/problems/:key/:slug?" element={<ProblemDetailsPage />} />
      </Route>

      {/* Standalone auth screens (no site chrome, signed-in users bounced) */}
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin (own sidebar/topbar chrome) */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="problems" element={<ProblemsManagement />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>
      </Route>
      </Routes>
      </Suspense>
    </>
  );
}
