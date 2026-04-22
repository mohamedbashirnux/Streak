import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/Category";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";

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

    if (category.days[todayIndex].status === "lost") {
      return NextResponse.json(
        { error: "Cannot check in after losing the day" },
        { status: 400 }
      );
    }

    // Update today's progress
    category.days[todayIndex].habits = habitProgress;
    
    // Calculate completion percentage
    const completedCount = habitProgress.filter((h: any) => h.completed === true).length;
    const totalHabits = category.habits.length;
    const completionRate = totalHabits > 0 ? completedCount / totalHabits : 0;
    
    // Day is "won" if at least one habit is completed (not all-or-nothing anymore)
    const anyCompleted = completedCount > 0;
    const allCompleted = completedCount === totalHabits;
    
    // Check if this is the first check-in of the day
    const isFirstCheckIn = category.days[todayIndex].status === "pending";
    
    category.days[todayIndex].dayWon = anyCompleted;
    category.days[todayIndex].status = anyCompleted ? "won" : "lost";

    let newStreak = category.currentStreak;
    let newStatus = category.status;
    let completedAt = category.completedAt;

    // Only increment streak on FIRST check-in of the day
    if (anyCompleted && isFirstCheckIn) {
      // Day won - continue streak (even if not all habits completed)
      newStreak += 1;
      category.totalDaysWon += 1;

      if (newStreak > category.longestStreak) {
        category.longestStreak = newStreak;
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
    } else if (!anyCompleted && isFirstCheckIn) {
      // Day lost on first check-in - reset streak
      newStreak = 0;
      category.totalDaysLost += 1;
    }
    // If not first check-in, just update habits but don't change streak

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
      dayWon: anyCompleted,
      completedCount,
      totalHabits,
      message: allCompleted
        ? newStatus === "completed"
          ? "🎉 Category completed! You transformed yourself!"
          : "🔥 Perfect day! All habits completed!"
        : anyCompleted
        ? `✅ Progress saved! ${completedCount}/${totalHabits} habits completed`
        : "💪 No habits completed today. Try again tomorrow!",
    });
  } catch (error) {
    console.error("Category check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}