import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update lastAlertSent timestamp
    await db.budget.updateMany({
      where: { userId: user.id },
      data: { lastAlertSent: new Date() },
    });

    return NextResponse.json(
      { success: true, message: "Budget alert timestamp updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating budget alert:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update budget alert" },
      { status: 500 }
    );
  }
}
