import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

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

// Only the real frontends (plus local dev) may call the API from a browser.
const allowedOrigins = [
  "https://bracketx.vercel.app",
  "https://codeforge-c4mz.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser clients (curl, health checks) send no Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json({ limit: "1mb" }));

// Brute-force protection on login/register.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts — try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use(
  "/api/problems",
  problemRoutes
);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminProblemRoutes);
app.use("/api/admin/users", adminUserRoutes);
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

// Must stay the LAST middleware so every route above reaches it.
app.use(errorHandler);

export default app;
