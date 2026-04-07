import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "info@ankhoptic.com";

    // Just notify the admin that a new user subscribed
    await sendMail({
      to: adminEmail,
      subject: `New Newsletter Subscriber 💌`,
      html: `
        <h2>New Newsletter Subscription!</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p>Yay, a new person signed up for the newsletter on Ankhoptic.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter-api] Error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
