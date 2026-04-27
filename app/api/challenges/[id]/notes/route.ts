import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ChallengeModel from "@/models/Challenge";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { date, notes } = await req.json();

    await connectDB();
    const challenge = await ChallengeModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    // Find the day and update notes
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const dayIndex = challenge.days.findIndex(
      (day) => new Date(day.date).getTime() === targetDate.getTime()
    );

    if (dayIndex === -1) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    challenge.days[dayIndex].notes = notes;
    await challenge.save();

    return NextResponse.json({
      message: "Note saved successfully",
      day: challenge.days[dayIndex],
    });
  } catch (error) {
    console.error("Save note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
