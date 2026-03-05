/**
 * Prisma Client with D1 Adapter
 * 每個 request 透過 env.DB 建立連線
 */
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export function getPrisma(d1: D1Database): PrismaClient {
  const adapter = new PrismaD1(d1);
  return new PrismaClient({ adapter });
}
