import { Resend } from "resend";
import { createEmailLog, updateEmailLog } from "./email-log";

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
  type?: string;
  leadId?: string;
  userId: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  type = "GENERAL",
  leadId,
  userId,
}: SendEmailProps) {
  // 1. Create PENDING log first
  const log = await createEmailLog({
    to,
    subject,
    type,
    status: "PENDING",
    leadId,
    userId,
  });

  try {
    // 2. Send email
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    // 3. Check Resend response
    if (result.error) {
      await updateEmailLog(log.id, {
        status: "FAILED",
        error: result.error.message,
      });

      return {
        success: false,
        error: result.error.message,
      };
    }

    // 4. Mark as SENT
    await updateEmailLog(log.id, {
      status: "SENT",
      error: null,
    });

    return {
      success: true,
      error: null,
      data: result.data,
    };
  } catch (err: any) {
    // 5. Catch unexpected failures
    await updateEmailLog(log.id, {
      status: "FAILED",
      error: err.message || "Unknown error",
    });

    return {
      success: false,
      error: err.message || "Email sending failed",
    };
  }
}