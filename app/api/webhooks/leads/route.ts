import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import LeadStatusChangeEmail from "@/emails/lead-status-email";
import { render } from "@react-email/render";

// Validation schema
const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

// WEBHOOK: CREATE LEAD
export async function POST(req: Request) {
  try {
    //  Validate API Key
    const auth = await validateApiKey(req);

    if (!auth) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Invalid or missing API key",
          },
        },
        { status: 401 }
      );
    }

    const user = auth.user;

    //  Rate limiting
    const limit = rateLimit(auth.apiKey.id);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: `Too many requests. Try again in ${limit.retryAfter}s`,
          },
        },
        { status: 429 }
      );
    }

    //  Parse body
    const body = await req.json();

    //  Validate input
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: result.error.issues[0].message,
          },
        },
        { status: 400 }
      );
    }

    const data = result.data;

    //  Create lead
    const lead = await prisma.lead.create({
      data: {
        ...data,
        status: "NEW",
        userId: user.id,
      },
    });

    //  Send email (FIXED)
    try {
      if (user.emailNotifications && user.email) {
        const emailHtml = await render(
          LeadStatusChangeEmail({
            leadName: lead.name,
            oldStatus: "N/A",
            newStatus: "NEW",
          })
        );

        await sendEmail({
          to: user.email,
          subject: `New Lead Received: ${lead.name}`,
          html: emailHtml,

          //  REQUIRED FIELDS (FIXED)
          userId: user.id,
          leadId: lead.id,
          type: "LEAD_CREATED",
        });
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      //  do not block webhook
    }

    // Response
    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}