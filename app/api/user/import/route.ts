import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import ChallengeModel from "@/models/Challenge";
import StatsModel from "@/models/Stats";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("importFile") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    if (!file.name.endsWith(".json")) {
      return NextResponse.json({ error: "Only JSON files are supported for import" }, { status: 400 });
    }

    const fileContent = await file.text();
    let importData;
    
    try {
      importData = JSON.parse(fileContent);
    } catch {
      return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
    }

    // Validate import data structure
    if (!importData.user || !importData.challenges) {
      return NextResponse.json({ error: "Invalid export file format" }, { status: 400 });
    }

    await connectDB();

    let importedCount = 0;

    // Import challenges (don't overwrite existing ones)
    if (importData.challenges && Array.isArray(importData.challenges)) {
      for (const challengeData of importData.challenges) {
        // Check if challenge already exists
        const existingChallenge = await ChallengeModel.findOne({
          userId: session.user.id,
          name: challengeData.name,
          startDate: new Date(challengeData.startDate),
        });

        if (!existingChallenge) {
          await ChallengeModel.create({
            ...challengeData,
            userId: session.user.id,
            startDate: new Date(challengeData.startDate),
            createdAt: new Date(challengeData.createdAt),
            completedAt: challengeData.completedAt ? new Date(challengeData.completedAt) : undefined,
            days: challengeData.days?.map((day: any) => ({
              ...day,
              date: new Date(day.date),
            })) || [],
          });
          importedCount++;
        }
      }
    }

    // Update user preferences if provided
    if (importData.user) {
      const updateData: any = {};
      if (importData.user.timezone) updateData.timezone = importData.user.timezone;
      if (importData.user.theme) updateData.theme = importData.user.theme;
      if (importData.user.badges) updateData.badges = importData.user.badges;
      
      if (Object.keys(updateData).length > 0) {
        await UserModel.findByIdAndUpdate(session.user.id, updateData);
      }
    }

    return NextResponse.json({ 
      message: `Successfully imported ${importedCount} challenges`,
      importedChallenges: importedCount,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}