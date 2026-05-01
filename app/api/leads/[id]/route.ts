import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { validateApiKey } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";
import LeadStatusChangeEmail from "@/emails/lead-status-email";

// Helpers
function apiSuccess(data: any) {
  return NextResponse.json({
    success: true,
    data,
  });
}

function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status }
  );
}

// GET SINGLE LEAD

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let userId: string | null = null;
    let apiKeyId: string | null = null;

    const auth = await validateApiKey(req);

    if (auth) {
      userId = auth.user.id;
      apiKeyId = auth.apiKey.id;
    } else {
      const user = await requireUser();
      userId = user.id;
    }

    if (apiKeyId) {
      const limit = rateLimit(apiKeyId);

      if (!limit.allowed) {
        return apiError(
          "RATE_LIMITED",
          `Too many requests. Try again in ${limit.retryAfter}s`,
          429
        );
      }
    }

    const lead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!lead) {
      return apiError("NOT_FOUND", "Lead not found", 404);
    }

    return apiSuccess(lead);
  } catch (error) {
    console.error("GET_LEAD_ERROR:", error);
    return apiError("SERVER_ERROR", "Something went wrong", 500);
  }
}

// UPDATE LEAD

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let userId: string | null = null;
    let apiKeyId: string | null = null;

    const auth = await validateApiKey(req);

    if (auth) {
      userId = auth.user.id;
      apiKeyId = auth.apiKey.id;
    } else {
      const user = await requireUser();
      userId = user.id;
    }

    if (apiKeyId) {
      const limit = rateLimit(apiKeyId);

      if (!limit.allowed) {
        return apiError(
          "RATE_LIMITED",
          `Too many requests. Try again in ${limit.retryAfter}s`,
          429
        );
      }
    }

    const body = await req.json();

    const existing = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return apiError("FORBIDDEN", "Access denied", 403);
    }

    const oldStatus = existing.status;

    const updated = await prisma.lead.update({
      where: { id },
      data: body,
    });

    // EMAIL LOGIC (FIXED)

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        emailNotifications: true,
      },
    });

    if (
      dbUser?.emailNotifications &&
      oldStatus !== updated.status &&
      dbUser.email
    ) {
      const html = await render(
        LeadStatusChangeEmail({
          leadName: updated.name,
          oldStatus,
          newStatus: updated.status,
        })
      );

      await sendEmail({
        to: dbUser.email,
        subject: `Lead Status Updated - ${updated.name}`,
        html,

        //  FIXED: required fields
        userId: userId!,
        leadId: updated.id,
        type: "LEAD_STATUS_CHANGE",
      });
    }

    return apiSuccess(updated);
  } catch (error) {
    console.error("UPDATE_LEAD_ERROR:", error);
    return apiError("SERVER_ERROR", "Failed to update", 500);
  }
}


// DELETE LEAD

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let userId: string | null = null;
    let apiKeyId: string | null = null;

    const auth = await validateApiKey(req);

    if (auth) {
      userId = auth.user.id;
      apiKeyId = auth.apiKey.id;
    } else {
      const user = await requireUser();
      userId = user.id;
    }

    if (apiKeyId) {
      const limit = rateLimit(apiKeyId);

      if (!limit.allowed) {
        return apiError(
          "RATE_LIMITED",
          `Too many requests. Try again in ${limit.retryAfter}s`,
          429
        );
      }
    }

    const existing = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return apiError("FORBIDDEN", "Access denied", 403);
    }

    await prisma.lead.delete({
      where: { id },
    });

    return apiSuccess({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE_LEAD_ERROR:", error);
    return apiError("SERVER_ERROR", "Failed to delete", 500);
  }
}