import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import {
  generateApiKey,
  hashApiKey,
  getApiKeyPrefix,
} from "@/lib/api-key";


  //  GET → fetch API keys

export async function GET() {
  try {
    const user = await requireUser();

    const keys = await prisma.apiKey.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: keys,
    });
  } catch (error) {
    console.error("API KEY FETCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch API keys",
      },
      { status: 500 }
    );
  }
}

  //  POST → create API key
export async function POST(req: Request) {
  try {
    const user = await requireUser();

    const body = await req.json();
    const name = body?.name;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Name is required",
          },
        },
        { status: 400 }
      );
    }

    // limit check
    const activeKeysCount = await prisma.apiKey.count({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    if (activeKeysCount >= 5) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LIMIT_EXCEEDED",
            message: "Maximum 5 active API keys allowed",
          },
        },
        { status: 400 }
      );
    }

    // generate key
    const rawKey = generateApiKey();
    const hashedKey = hashApiKey(rawKey);
    const prefix = getApiKeyPrefix(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        prefix,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey, // only shown once
        prefix: apiKey.prefix,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    console.error("API KEY CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
}