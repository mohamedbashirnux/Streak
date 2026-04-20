import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ChallengeModel from "@/models/Challenge";
import LifeChapterModel from "@/models/LifeChapter";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Delete all challenges for this user
    await ChallengeModel.deleteMany({ userId: session.user.id });

    // Delete all life chapters for this user
    await LifeChapterModel.deleteMany({ userId: session.user.id });

    // Reset stats to zero
    await StatsModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        totalChallenges: 0,
        totalCompleted: 0,
        totalFailed: 0,
        longestStreakEver: 0,
        totalDaysCompleted: 0,
        totalLifeChapters: 0,
        totalChaptersCompleted: 0,
        totalPerfectDays: 0,
      },
      { upsert: true }
    );

    // Clear badges from user
    await UserModel.findByIdAndUpdate(session.user.id, {
      badges: [],
    });

    return NextResponse.json({
      message: "All challenges, life chapters, stats, and badges cleared successfully!",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
