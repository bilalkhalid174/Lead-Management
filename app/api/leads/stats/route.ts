import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const total = await prisma.lead.count({
      where: { userId: session.user.id },
    });

    const stats = await prisma.lead.groupBy({
      by: ["status"],
      _count: true,
      where: { userId: session.user.id },
    });

    const statusCounts = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      LOST: 0,
      CONVERTED: 0,
    };

    stats.forEach((stat) => {
      statusCounts[stat.status] = stat._count;
    });

    return NextResponse.json({ total, ...statusCounts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats", details: String(error) },
      { status: 500 }
    );
  }
}