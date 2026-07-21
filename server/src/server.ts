// Load + validate environment before anything else imports it.
import { env } from "./config/env";

import type { Server } from "http";
import app from "./app";
import prisma from "./prisma/prisma";

const PORT = Number(env.PORT);

let server: Server;

async function start() {
  // Verify the database is actually reachable before we start accepting
  // traffic — otherwise the server reports "listening" and then 500s on the
  // first query when DATABASE_URL is wrong/unreachable.
  await prisma.$connect();
  console.log("✅ Database connected");

  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

// Close the HTTP server and DB pool cleanly so in-flight requests finish and
// connections aren't leaked across deploys/restarts.
async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server?.close(async () => {
    await prisma.$disconnect();
    console.log("👋 Closed out remaining connections");
    process.exit(0);
  });

  // Don't hang forever if something refuses to close.
  setTimeout(() => {
    console.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  // An uncaught exception leaves the process in an undefined state — exit and
  // let the platform restart it.
  process.exit(1);
});
