import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY ?? "";
let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY");
    }
    resendClient = new Resend(resendApiKey);
  }
  return resendClient;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResendClient();
  return resend.emails.send({
    from: "Helix HR <onboarding@resend.dev>",
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
