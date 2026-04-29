import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// GET
export async function GET() {
  try {
    const user = await requireUser();

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json(currentUser);
  } catch (err) {

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();


    const { name, email, emailNotifications } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        emailNotifications: Boolean(emailNotifications), 
      },
    });


    return NextResponse.json(updatedUser);

  } catch (err) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}