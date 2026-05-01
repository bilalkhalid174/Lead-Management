import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/api-key";

/**
 * Extract and validate API key from Authorization header
 */
export async function validateApiKey(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.replace("Bearer ", "").trim();

  if (!rawKey) {
    return null;
  }

  const hashedKey = hashApiKey(rawKey);

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      key: hashedKey,
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  if (!apiKey) {
    return null;
  }

  // update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    user: apiKey.user,
    apiKey,
  };
}