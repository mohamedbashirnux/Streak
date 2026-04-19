import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ChallengeModel from "@/models/Challenge";
import StatsModel from "@/models/Stats";

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

    await connectDB();
    const challenge = await ChallengeModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.status !== "failed") {
      return NextResponse.json(
        { error: "Can only restart failed challenges" },
        { status: 400 }
      );
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const days = Array.from({ length: challenge.duration }, (_, i) => ({
      date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
      status: "pending" as const,
    }));

    challenge.startDate = start;
    challenge.status = "active";
    challenge.currentStreak = 0;
    challenge.days = days;
    challenge.completedAt = undefined;

    await challenge.save();

    await StatsModel.findOneAndUpdate(
      { userId: session.user.id },
      { $inc: { totalChallenges: 1 } }
    );

    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Restart challenge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
