import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

export const runtime = "nodejs";

// GET - Get all categories for user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const categories = await CategoryModel.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new category
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, duration, habits } = await req.json();

    if (!title || !duration || !habits || habits.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration - 1);

    // Generate daily progress array
    const days = [];
    for (let i = 0; i < duration; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      days.push({
        date,
        habits: habits.map((habit: any) => ({
          habitId: habit.id,
          completed: false,
        })),
        dayWon: false,
        status: "pending",
      });
    }

    const category = new CategoryModel({
      userId: session.user.id,
      title,
      description: description || "",
      duration,
      startDate,
      endDate,
      habits,
      days,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysWon: 0,
      totalDaysLost: 0,
      status: "active",
    });

    await category.save();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}