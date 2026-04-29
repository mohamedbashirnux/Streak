import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import DailyChallengeModel from "@/models/DailyChallenge";
import UserDailyChallengeModel from "@/models/UserDailyChallenge";
import { generateDailyChallenges } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await connectDB();

    // Check if daily challenges exist for today
    let dailyChallenges = await DailyChallengeModel.find({
      date: today,
      isActive: true,
    });

    // If no challenges exist for today, generate them
    if (dailyChallenges.length === 0) {
      const challengeTemplates = generateDailyChallenges(today);
      
      const newChallenges = await DailyChallengeModel.insertMany(
        challengeTemplates.map(template => ({
          ...template,
          date: today,
          isActive: true,
        }))
      );
      
      dailyChallenges = newChallenges;
    }

    // Get user's progress on today's challenges
    const userProgress = await UserDailyChallengeModel.find({
      userId: session.user.id,
      date: today,
    });

    // Combine challenges with user progress
    const challengesWithProgress = dailyChallenges.map(challenge => {
      const progress = userProgress.find(
        p => p.challengeId === challenge._id.toString()
      );
      
      return {
        ...challenge.toObject(),
        completed: progress?.completed || false,
        progress: progress?.progress || 0,
        xpEarned: progress?.xpEarned || 0,
      };
    });

    return NextResponse.json({
      challenges: challengesWithProgress,
      date: today,
    });
  } catch (error) {
    console.error("Daily challenges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = await request.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await connectDB();

    // Get the challenge
    const challenge = await DailyChallengeModel.findById(challengeId);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    // Check if user already completed this challenge today
    const existingProgress = await UserDailyChallengeModel.findOne({
      userId: session.user.id,
      challengeId,
      date: today,
    });

    if (existingProgress?.completed) {
      return NextResponse.json({ error: "Challenge already completed" }, { status: 400 });
    }

    // Mark challenge as completed and award XP
    const userChallenge = await UserDailyChallengeModel.findOneAndUpdate(
      {
        userId: session.user.id,
        challengeId,
        date: today,
      },
      {
        completed: true,
        progress: challenge.target || 1,
        xpEarned: challenge.xpReward,
      },
      { upsert: true, new: true }
    );

    // Award XP to user (this would be handled by the awardXP function)
    // For now, we'll update the user's XP directly
    const { awardXP } = await import("@/lib/utils");
    await awardXP(session.user.id, challenge.xpReward, `Daily Challenge: ${challenge.title}`);

    return NextResponse.json({
      message: "Challenge completed!",
      xpEarned: challenge.xpReward,
      userChallenge,
    });
  } catch (error) {
    console.error("Complete daily challenge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}