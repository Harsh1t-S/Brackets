import { Navigate, Route, Routes, useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { RequireAuth, RequireAdmin, GuestOnly } from "./ProtectedRoute";

import HomePage from "../../features/home/HomePage";
import ProblemsPage from "../../features/problems/pages/ProblemsPage";
import ProblemDetailsPage from "../../features/problems/pages/ProblemDetailsPage";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import AdminLayout from "../../features/admin/layouts/AdminLayout";

import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import ProblemsManagement from "../../features/admin/pages/ProblemsManagement";
import UsersManagement from "../../features/admin/pages/UsersManagement";
import BookmarksPage from "../../features/bookmarks/pages/BookmarksPage";
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
      <Routes>
      {/* Marketing + app pages (with site navbar/footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:key/:slug?" element={<ProblemDetailsPage />} />
        <Route path="/:key" element={<ProblemShortcut />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
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
    </>
  );
}
