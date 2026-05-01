import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { validateApiKey } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { Status } from "@prisma/client";

// Helpers
function apiSuccess(data: any, meta?: any) {
  return NextResponse.json({
    success: true,
    data,
    meta,
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

// GET LEADS
export async function GET(req: Request) {
  try {
    //  Auth (API key OR session)
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

    // 🚦 Rate limit (only API key usage)
    if (apiKeyId) {
      const limitCheck = rateLimit(apiKeyId);

      if (!limitCheck.allowed) {
        return apiError(
          "RATE_LIMITED",
          `Too many requests. Try again in ${limitCheck.retryAfter}s`,
          429
        );
      }
    }

    //  Query params
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    //  Safe enum validation
    const status: Status | undefined =
      statusParam && Object.values(Status).includes(statusParam as Status)
        ? (statusParam as Status)
        : undefined;

    const where = {
      userId,
      ...(status ? { status } : {}),
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return apiSuccess(leads, {
      total,
    });
  } catch (error) {
    console.error("GET_LEADS_ERROR:", error);
    return apiError("SERVER_ERROR", "Something went wrong", 500);
  }
}

// CREATE LEAD
export async function POST(req: Request) {
  try {
    //  Auth
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

    //  Rate limit
    if (apiKeyId) {
      const limitCheck = rateLimit(apiKeyId);

      if (!limitCheck.allowed) {
        return apiError(
          "RATE_LIMITED",
          `Too many requests. Try again in ${limitCheck.retryAfter}s`,
          429
        );
      }
    }

    const body = await req.json();
    const { name, email, phone, company, status, notes } = body;

    if (!name || !email) {
      return apiError("VALIDATION_ERROR", "Name and email required", 400);
    }

    //  Duplicate check (scoped to user)
    const existing = await prisma.lead.findFirst({
      where: {
        email,
        userId,
      },
    });

    if (existing) {
      return apiError(
        "DUPLICATE",
        "Lead already exists with this email",
        409
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
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: lead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE_LEAD_ERROR:", error);
    return apiError(
      "SERVER_ERROR",
      error.message || "Failed to create lead",
      500
    );
  }
}