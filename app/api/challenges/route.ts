import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ChallengeModel from "@/models/Challenge";
import StatsModel from "@/models/Stats";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const challenges = await ChallengeModel.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Get challenges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type, duration, motivation, startDate } = await req.json();

    if (!name || !type || !duration) {
      return NextResponse.json(
        { error: "Name, type, and duration are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);

    const days = Array.from({ length: duration }, (_, i) => ({
      date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
      status: "pending" as const,
    }));

    const challenge = await ChallengeModel.create({
      userId: session.user.id,
      name,
      type,
      duration,
      motivation,
      startDate: start,
      status: "active",
      currentStreak: 0,
      longestStreak: 0,
      days,
    });

    await StatsModel.findOneAndUpdate(
      { userId: session.user.id },
      { $inc: { totalChallenges: 1 } },
      { upsert: true }
    );

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error("Create challenge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
