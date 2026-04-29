import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/welcome-email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const html = await render(
      WelcomeEmail({ name })
    );

    await sendEmail({
      to: "jarwis1741@gmail.com",
      subject: "Welcome 🎉",
      html,
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}