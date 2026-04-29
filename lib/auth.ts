import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

//  reusable auth guard
export async function requireUser() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

