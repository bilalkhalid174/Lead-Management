
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// ✅ GET ALL LEADS (FILTERED BY USER)
export async function GET() {
  try {
    const user = await requireUser();

    const leads = await prisma.lead.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// ✅ CREATE LEAD (AUTO USER ID)
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const { name, email, phone, company, status, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }

    const existing = await prisma.lead.findFirst({
      where: {
        email,
        userId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Lead already exists" },
        { status: 409 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        status: status || "NEW",
        notes,
        userId: user.id,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}