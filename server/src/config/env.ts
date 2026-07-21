import dotenv from "dotenv";

dotenv.config();

/**
 * Fail fast on missing configuration. Reading these lazily at request time
 * (e.g. `process.env.JWT_SECRET as string`) hides misconfiguration until a
 * user hits the endpoint — validate once at boot instead.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Set it before starting the server (see server/.env.example).`
    );
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? "5000",
  JWT_SECRET: required("JWT_SECRET"),
  DATABASE_URL: required("DATABASE_URL"),
};

export const isProduction = env.NODE_ENV === "production";
