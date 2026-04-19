import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import StatsModel from "@/models/Stats";
import UserModel from "@/models/User";

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

    return NextResponse.json({
      ...stats.toObject(),
      badges: user?.badges || [],
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
