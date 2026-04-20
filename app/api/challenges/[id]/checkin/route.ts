import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import ChallengeModel from "@/models/Challenge";
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
    const { success } = await req.json();

    await connectDB();
    const challenge = await ChallengeModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.status !== "active") {
      return NextResponse.json(
        { error: "Challenge is not active" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayIndex = challenge.days.findIndex(
      (day) => new Date(day.date).getTime() === today.getTime()
    );

    if (todayIndex === -1) {
      return NextResponse.json(
        { error: "No check-in available for today" },
        { status: 400 }
      );
    }

    if (challenge.days[todayIndex].status !== "pending") {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 400 }
      );
    }

    let newStreak = challenge.currentStreak;
    let newStatus: "active" | "completed" | "failed" = challenge.status;
    let completedAt = challenge.completedAt;
    let earnedBadge: string | null = null;

    if (success) {
      newStreak += 1;
      challenge.days[todayIndex].status = "success";

      if (newStreak > challenge.longestStreak) {
        challenge.longestStreak = newStreak;
      }

      earnedBadge = checkBadgeEarned(newStreak);

      if (earnedBadge) {
        await UserModel.findByIdAndUpdate(session.user.id, {
          $addToSet: { badges: earnedBadge },
        });
      }

      if (newStreak === challenge.duration) {
        newStatus = "completed";
        completedAt = new Date();
        await StatsModel.findOneAndUpdate(
          { userId: session.user.id },
          {
            $inc: {
              totalCompleted: 1,
              totalDaysCompleted: challenge.duration,
            },
            $max: { longestStreakEver: newStreak },
          }
        );
      } else {
        await StatsModel.findOneAndUpdate(
          { userId: session.user.id },
          {
            $inc: { totalDaysCompleted: 1 },
            $max: { longestStreakEver: newStreak },
          }
        );
      }
    } else {
      newStreak = 0;
      newStatus = "failed";
      challenge.days[todayIndex].status = "failed";

      await StatsModel.findOneAndUpdate(
        { userId: session.user.id },
        { $inc: { totalFailed: 1 } }
      );
    }

    challenge.currentStreak = newStreak;
    challenge.status = newStatus;
    challenge.completedAt = completedAt;

    await challenge.save();

    return NextResponse.json({
      challenge,
      earnedBadge,
      message: success
        ? newStatus === "completed"
          ? "🎉 Challenge completed!"
          : "✅ Day completed!"
        : "Don't give up! You can restart and try again.",
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
