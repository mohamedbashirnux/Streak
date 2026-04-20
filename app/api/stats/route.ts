import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";
import CategoryModel from "@/models/Category";

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

    // Get Category stats
    const categories = await CategoryModel.find({ userId: session.user.id });
    const totalCategories = categories.length;
    const totalCategoriesCompleted = categories.filter(c => c.status === "completed").length;
    const totalPerfectDays = categories.reduce((sum, category) => sum + category.totalDaysWon, 0);

    return NextResponse.json({
      ...stats.toObject(),
      badges: user?.badges || [],
      totalCategories: totalCategories,
      totalCategoriesCompleted: totalCategoriesCompleted,
      totalPerfectDays,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
