import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import StatsModel from "@/models/Stats";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "xp"; // xp, streak, challenges
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    let leaderboard = [];

    if (type === "xp") {
      // XP Leaderboard
      leaderboard = await UserModel.find({})
        .select("name avatar totalXP level")
        .sort({ totalXP: -1 })
        .limit(limit)
        .lean();
    } else if (type === "streak") {
      // Streak Leaderboard
      const stats = await StatsModel.find({})
        .populate("userId", "name avatar")
        .sort({ longestStreakEver: -1 })
        .limit(limit)
        .lean();
      
      leaderboard = stats.map(stat => ({
        _id: stat.userId._id,
        name: stat.userId.name,
        avatar: stat.userId.avatar,
        longestStreak: stat.longestStreakEver,
        totalChallenges: stat.totalChallenges,
      }));
    } else if (type === "challenges") {
      // Total Challenges Leaderboard
      const stats = await StatsModel.find({})
        .populate("userId", "name avatar")
        .sort({ totalCompleted: -1 })
        .limit(limit)
        .lean();
      
      leaderboard = stats.map(stat => ({
        _id: stat.userId._id,
        name: stat.userId.name,
        avatar: stat.userId.avatar,
        totalCompleted: stat.totalCompleted,
        totalChallenges: stat.totalChallenges,
      }));
    }

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Find current user's position
    const currentUserRank = rankedLeaderboard.findIndex(
      entry => entry._id.toString() === session.user.id
    ) + 1;

    return NextResponse.json({
      leaderboard: rankedLeaderboard,
      currentUserRank: currentUserRank || null,
      type,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}