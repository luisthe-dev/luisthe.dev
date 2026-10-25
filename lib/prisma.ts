import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// Ensure Neon queries use low-latency HTTP fetch rather than persistent WebSockets
// This prevents connection drops when Cloudflare Workers/Pages freezes idle serverless isolates
neonConfig.poolQueryViaFetch = true;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function cleanConnectionString(url: string): string {
  if (!url) return "";
  return url
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "");
}

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL || "";
  const connectionString = cleanConnectionString(rawUrl);

  // PrismaNeonHttp communicates over stateless HTTPS fetch requests
  // Highly resilient on Cloudflare Edge / Serverless runtimes with zero dependencies on 'ws'
  const adapter = new PrismaNeonHttp(connectionString, {});

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
