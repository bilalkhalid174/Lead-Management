import "dotenv/config";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL environment variable is not set");
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

export async function GET() {
  const prisma = getPrismaClient();
  try {
    const total = await prisma.lead.count();
    const stats = await prisma.lead.groupBy({ by: ["status"], _count: true });
    const statusCounts = { NEW: 0, CONTACTED: 0, QUALIFIED: 0, LOST: 0, CONVERTED: 0 };
    stats.forEach((stat) => {
      statusCounts[stat.status] = stat._count;
    });
    await prisma.$disconnect();
    return NextResponse.json({ total, ...statusCounts });
  } catch (error) {
    await prisma.$disconnect();
    return NextResponse.json({ error: "Failed to fetch stats", details: String(error) }, { status: 500 });
  }
}
