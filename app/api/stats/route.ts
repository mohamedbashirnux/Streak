import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";
import LifeChapterModel from "@/models/LifeChapter";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    let stats = await StatsModel.findOne({ userId: session.user.id });
    
    if (!stats) {
      stats = await StatsModel.create({ userId: session.user.id });
    }

    const user = await UserModel.findById(session.user.id);

    // Get Life Chapter stats
    const lifeChapters = await LifeChapterModel.find({ userId: session.user.id });
    const totalLifeChapters = lifeChapters.length;
    const totalChaptersCompleted = lifeChapters.filter(c => c.status === "completed").length;
    const totalPerfectDays = lifeChapters.reduce((sum, chapter) => sum + chapter.totalDaysWon, 0);

    return NextResponse.json({
      ...stats.toObject(),
      badges: user?.badges || [],
      totalLifeChapters,
      totalChaptersCompleted,
      totalPerfectDays,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
