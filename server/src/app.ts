import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.routes";
import problemRoutes from "./modules/problem/problem.routes";
import bookmarkRoutes from "./modules/bookmark/bookmark.routes";
import adminProblemRoutes from "./modules/admin/adminProblem.routes";
import adminUserRoutes from "./modules/admin/adminUser.routes";
import { errorHandler } from "./middleware/error.middleware";
import adminDashboardRoutes from "./modules/adminDashboard/adminDashboard.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import prisma from "./prisma/prisma";

const app = express();

// Behind Railway/Vercel the client IP is in X-Forwarded-For; without this the
// rate limiter keys on the proxy IP (all clients look like one). Trust one hop.
app.set("trust proxy", 1);

// Baseline security headers (HSTS, X-Content-Type-Options, frame-guard, …).
app.use(helmet());

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

// General throttle across the whole API to blunt scraping/abuse of the
// unauthenticated endpoints (problem list, stats, …).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests — slow down." },
});

// Tighter brute-force protection on login/register.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts — try again later." },
});

app.use("/api", apiLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminProblemRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Bracket API Running 🚀" });
});

// Readiness probe: verifies the process is up AND the DB is reachable, so a
// load balancer can tell "listening" apart from "actually healthy".
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, status: "ok", database: "up" });
  } catch {
    res
      .status(503)
      .json({ success: false, status: "degraded", database: "down" });
  }
});

// Unmatched routes return the app's JSON shape instead of Express's HTML 404.
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Must stay the LAST middleware so every route above reaches it.
app.use(errorHandler);

export default app;
