import { PrismaClient } from "@prisma/client";

// Correctly type `global` to prevent TypeScript errors
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ["query", "info", "warn", "error"], // Enable logs for debugging
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client"; // Re-export Prisma models & types
