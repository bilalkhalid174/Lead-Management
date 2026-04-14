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
  
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const prisma = getPrismaClient();

  try {
    const { id } = await Promise.resolve(params);
    const body = await request.json();
    const { name, email, phone, company, status, notes } = body;

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Check if new email already exists (and is different from current)
    if (email && email !== existingLead.email) {
      const emailExists = await prisma.lead.findUnique({
        where: { email },
      });

      if (emailExists) {
        await prisma.$disconnect();
        return NextResponse.json(
          { error: "Lead with this email already exists" },
          { status: 409 }
        );
      }
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(company !== undefined && { company: company || null }),
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(updatedLead);
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const prisma = getPrismaClient();

  try {
    const { id } = await Promise.resolve(params);

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    await prisma.lead.delete({
      where: { id },
    });

    await prisma.$disconnect();
    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Failed to delete lead", details: String(error) },
      { status: 500 }
    );
  }
}
