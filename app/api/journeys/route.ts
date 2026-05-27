import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import JourneyModel from "@/models/Journey";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const journeys = await JourneyModel.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(journeys);
  } catch (error) {
    console.error("Get journeys error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, color, duration, startDate } = await req.json();

    if (!name || !duration) {
      return NextResponse.json({ error: "Name and duration are required" }, { status: 400 });
    }

    await connectDB();

    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);

    const journey = await JourneyModel.create({
      userId: session.user.id,
      name,
      description: description || "",
      color: color || "#22c55e",
      duration,
      startDate: start,
      status: "active",
    });

    return NextResponse.json(journey, { status: 201 });
  } catch (error) {
    console.error("Create journey error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
