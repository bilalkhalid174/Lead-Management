import { prisma } from "@/lib/prisma";

type CreateLogProps = {
  to: string;
  subject: string;
  type: string;
  status: "PENDING" | "SENT" | "FAILED";
  error?: string | null;
  leadId?: string;
  userId: string;
};

export async function createEmailLog(data: CreateLogProps) {
  return await prisma.emailLog.create({
    data,
  });
}

export async function updateEmailLog(
  id: string,
  data: Partial<Pick<CreateLogProps, "status" | "error">>
) {
  return await prisma.emailLog.update({
    where: { id },
    data,
  });
}