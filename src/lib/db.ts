import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

// Parse DATABASE_URL: mysql://user:pass@host:3306/dbname
const url = new URL(process.env.DATABASE_URL ?? "mysql://root:@localhost:3306/ankhoptics");

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username || "root",
  password: url.password || undefined,
  database: url.pathname.replace("/", ""),
  connectionLimit: 10,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
