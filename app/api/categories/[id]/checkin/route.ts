import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
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
    const category = await CategoryModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.status !== "active") {
      return NextResponse.json(
        { error: "Category is not active" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIndex = category.days.findIndex(
      (day) => new Date(day.date).getTime() === today.getTime()
    );

    if (todayIndex === -1) {
      return NextResponse.json(
        { error: "No check-in available for today" },
        { status: 400 }
      );
    }

    if (category.days[todayIndex].status !== "pending") {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 400 }
      );
    }

    // Update today's progress
    category.days[todayIndex].habits = habitProgress;
    
    // Check if ALL habits are completed (day won)
    // If no habits exist, consider it a won day (empty category)
    const allCompleted = category.habits.length === 0 ? true : habitProgress.every((h: any) => h.completed === true);
    category.days[todayIndex].dayWon = allCompleted;
    category.days[todayIndex].status = allCompleted ? "won" : "lost";

    let newStreak = category.currentStreak;
    let newStatus = category.status;
    let completedAt = category.completedAt;
    let earnedBadge: string | null = null;

    if (allCompleted) {
      // Day won - continue streak
      newStreak += 1;
      category.totalDaysWon += 1;

      if (newStreak > category.longestStreak) {
        category.longestStreak = newStreak;
      }

      // Check for badge
      earnedBadge = checkBadgeEarned(newStreak, category.duration);
      if (earnedBadge) {
        await UserModel.findByIdAndUpdate(session.user.id, {
          $addToSet: { badges: earnedBadge },
        });
      }

      // Check if category completed
      if (newStreak === category.duration) {
        newStatus = "completed";
        completedAt = new Date();
        
        await StatsModel.findOneAndUpdate(
          { userId: session.user.id },
          {
            $inc: {
              totalCategoriesCompleted: 1,
              totalPerfectDays: category.totalDaysWon,
            },
          },
          { upsert: true }
        );
      }
    } else {
      // Day lost - reset streak
      newStreak = 0;
      category.totalDaysLost += 1;
    }

    category.currentStreak = newStreak;
    category.status = newStatus;
    category.completedAt = completedAt;

    await category.save();

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
      category,
      earnedBadge,
      dayWon: allCompleted,
      message: allCompleted
        ? newStatus === "completed"
          ? "🎉 Category completed! You transformed yourself!"
          : "🔥 Perfect day! All habits completed!"
        : "💪 Keep going! Tomorrow is a new chance to win the day.",
    });
  } catch (error) {
    console.error("Category check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}