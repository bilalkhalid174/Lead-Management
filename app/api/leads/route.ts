import "dotenv/config";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Create a fresh Prisma client for each request to avoid stale credentials
function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set!");
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  console.log("Connecting with DATABASE_URL:", databaseUrl.replace(/:[^:]*@/, ":***@"));
  
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });
}

export async function GET() {
  const prisma = getPrismaClient();

  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        id: "asc",
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(leads);
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();

  try {
    const body = await request.json();
    const { name, email, phone, company, status, notes } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email },
    });

    if (existingLead) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Lead with this email already exists" },
        { status: 409 }
      );
    }

    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        status: status || "NEW",
        notes: notes || null,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead", details: String(error) },
      { status: 500 }
    );
  }
}
