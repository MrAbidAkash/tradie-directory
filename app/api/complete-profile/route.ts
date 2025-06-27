// app/api/complete-profile/route.ts
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    await connectToDatabase();
    await User.findByIdAndUpdate(userId, {
      profileComplete: true,
      lastReminderSent: null,
      remindersSent: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update profile status" },
      { status: 500 },
    );
  }
}
