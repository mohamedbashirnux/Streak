import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import ChallengeModel from "@/models/Challenge";
import StatsModel from "@/models/Stats";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    await connectDB();

    // Get all user data
    const user = await UserModel.findById(session.user.id).select("-password");
    const challenges = await ChallengeModel.find({ userId: session.user.id });
    const stats = await StatsModel.findOne({ userId: session.user.id });

    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        badges: user?.badges,
        timezone: user?.timezone,
        theme: user?.theme,
        createdAt: user?.createdAt,
      },
      challenges: challenges.map(challenge => ({
        name: challenge.name,
        type: challenge.type,
        duration: challenge.duration,
        motivation: challenge.motivation,
        startDate: challenge.startDate,
        status: challenge.status,
        currentStreak: challenge.currentStreak,
        longestStreak: challenge.longestStreak,
        days: challenge.days,
        createdAt: challenge.createdAt,
        completedAt: challenge.completedAt,
      })),
      stats: stats ? {
        totalChallenges: stats.totalChallenges,
        totalCompleted: stats.totalCompleted,
        totalFailed: stats.totalFailed,
        longestStreakEver: stats.longestStreakEver,
        totalDaysCompleted: stats.totalDaysCompleted,
      } : null,
      exportedAt: new Date().toISOString(),
    };

    if (format === "csv") {
      // Convert to CSV format for challenges
      const csvHeaders = "Challenge Name,Type,Duration,Status,Current Streak,Longest Streak,Start Date,Created At\n";
      const csvRows = challenges.map(c => 
        `"${c.name}","${c.type}",${c.duration},"${c.status}",${c.currentStreak},${c.longestStreak},"${c.startDate}","${c.createdAt}"`
      ).join("\n");
      
      const csvContent = csvHeaders + csvRows;
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="neverbreak-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default JSON format
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="neverbreak-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}