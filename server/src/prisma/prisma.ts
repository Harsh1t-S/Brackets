import { PrismaClient } from "@prisma/client";
import { isProduction } from "../config/env";

const prisma = new PrismaClient({
  log: isProduction ? ["warn", "error"] : ["warn", "error"],
});

export default prisma;
