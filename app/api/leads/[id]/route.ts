  import { NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";
  import { requireUser } from "@/lib/auth";
  import { sendEmail } from "@/lib/email";
  import { render } from "@react-email/render";
  import LeadStatusChangeEmail from "@/emails/lead-status-email";

  // GET
  export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const user = await requireUser();

      const lead = await prisma.lead.findFirst({
        where: { id, userId: user.id },
      });

      if (!lead) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(lead);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // UPDATE
  export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const user = await requireUser();
      const body = await req.json();

      const existing = await prisma.lead.findFirst({
        where: { id, userId: user.id },
      });

      if (!existing) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const oldStatus = existing.status;

      const updated = await prisma.lead.update({
        where: { id },
        data: body,
      });

      // check toggle
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { emailNotifications: true },
      });

      // FIXED CONDITION
      if (
        dbUser?.emailNotifications &&
        oldStatus !== updated.status
      ) {
        const html = await render(
          LeadStatusChangeEmail({
            leadName: updated.name,
            oldStatus,
            newStatus: updated.status,
          })
        );

        await sendEmail({
          to: "jarwis1741@gmail.com",
          subject: `Lead Status Updated - ${updated.name}`,
          html,
        });
      }

      return NextResponse.json(updated);
    } catch {
      return NextResponse.json(
        { error: "Failed to update" },
        { status: 500 }
      );
    }
  }

  // DELETE
  export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const user = await requireUser();

      const existing = await prisma.lead.findFirst({
        where: { id, userId: user.id },
      });

      if (!existing) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      await prisma.lead.delete({ where: { id } });

      return NextResponse.json({ message: "Deleted" });
    } catch {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
  }