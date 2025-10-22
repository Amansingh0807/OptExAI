import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY); // Set API Key

export async function POST(req) {
  try {
    const { email, subject, message, isBudgetAlert } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Send email using SendGrid
    await sendgrid.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Replace with your verified sender email
      subject,
      text: message,
    });

    // ✅ If this is a budget alert, update lastAlertSent timestamp
    if (isBudgetAlert) {
      const { userId } = await auth();
      if (userId) {
        const user = await db.user.findUnique({
          where: { clerkUserId: userId },
        });

        if (user) {
          await db.budget.updateMany({
            where: { userId: user.id },
            data: { lastAlertSent: new Date() },
          });
        }
      }
    }

    // ✅ Return JSON response
    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
