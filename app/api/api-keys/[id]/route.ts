import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  try {
    const user = await requireUser();

    const { id } = await params; // ✅ FIX

    // check if key exists
    const key = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!key) {
      return NextResponse.json(
        { success: false, message: "API key not found" },
        { status: 404 }
      );
    }

    // delete key
    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "API key deleted",
    });
  } catch (error) {
    console.error("DELETE API KEY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete key" },
      { status: 500 }
    );
  }
}