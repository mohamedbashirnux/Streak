import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import LifeChapterModel from "@/models/LifeChapter";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";
import { checkBadgeEarned } from "@/lib/utils";

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
    const { habitProgress } = await req.json(); // Array of { habitId, completed, notes? }

    await connectDB();
    const chapter = await LifeChapterModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!chapter) {
      return NextResponse.json({ error: "Life chapter not found" }, { status: 404 });
    }

    if (chapter.status !== "active") {
      return NextResponse.json(
        { error: "Life chapter is not active" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIndex = chapter.days.findIndex(
      (day) => new Date(day.date).getTime() === today.getTime()
    );

    if (todayIndex === -1) {
      return NextResponse.json(
        { error: "No check-in available for today" },
        { status: 400 }
      );
    }

    if (chapter.days[todayIndex].status !== "pending") {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 400 }
      );
    }

    // Update today's progress
    chapter.days[todayIndex].habits = habitProgress;
    
    // Check if ALL habits are completed (day won)
    const allCompleted = habitProgress.every((h: any) => h.completed === true);
    chapter.days[todayIndex].dayWon = allCompleted;
    chapter.days[todayIndex].status = allCompleted ? "won" : "lost";

    let newStreak = chapter.currentStreak;
    let newStatus = chapter.status;
    let completedAt = chapter.completedAt;
    let earnedBadge: string | null = null;

    if (allCompleted) {
      // Day won - continue streak
      newStreak += 1;
      chapter.totalDaysWon += 1;

      if (newStreak > chapter.longestStreak) {
        chapter.longestStreak = newStreak;
      }

      // Check for badge
      earnedBadge = checkBadgeEarned(newStreak, chapter.duration);
      if (earnedBadge) {
        await UserModel.findByIdAndUpdate(session.user.id, {
          $addToSet: { badges: earnedBadge },
        });
      }

      // Check if chapter completed
      if (newStreak === chapter.duration) {
        newStatus = "completed";
        completedAt = new Date();
        
        await StatsModel.findOneAndUpdate(
          { userId: session.user.id },
          {
            $inc: {
              totalChaptersCompleted: 1,
              totalPerfectDays: chapter.totalDaysWon,
            },
          },
          { upsert: true }
        );
      }
    } else {
      // Day lost - reset streak
      newStreak = 0;
      chapter.totalDaysLost += 1;
    }

    chapter.currentStreak = newStreak;
    chapter.status = newStatus;
    chapter.completedAt = completedAt;

    await chapter.save();

    // Update stats
    await StatsModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        $inc: { totalPerfectDays: allCompleted ? 1 : 0 },
        $max: { longestStreakEver: newStreak },
      },
      { upsert: true }
    );

    return NextResponse.json({
      chapter,
      earnedBadge,
      dayWon: allCompleted,
      message: allCompleted
        ? newStatus === "completed"
          ? "🎉 Life Chapter completed! You transformed yourself!"
          : "🔥 Perfect day! All habits completed!"
        : "💪 Keep going! Tomorrow is a new chance to win the day.",
    });
  } catch (error) {
    console.error("Life chapter check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}