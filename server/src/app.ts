import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import problemRoutes
from "./modules/problem/problem.routes";
import bookmarkRoutes from "./modules/bookmark/bookmark.routes";
import adminProblemRoutes from "./modules/admin/adminProblem.routes";
import adminUserRoutes from "./modules/admin/adminUser.routes";
import { errorHandler } from "./middleware/error.middleware";
import adminDashboardRoutes from "./modules/adminDashboard/adminDashboard.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use(
  "/api/problems",
  problemRoutes
);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminProblemRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use(errorHandler);
app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.get("/", (_, res) => {
  res.json({
    message: "Bracket API Running 🚀",
  });
});

export default app;