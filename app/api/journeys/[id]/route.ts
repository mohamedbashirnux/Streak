import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import JourneyModel from "@/models/Journey";
import ChallengeModel from "@/models/Challenge";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const journey = await JourneyModel.findOne({ _id: id, userId: session.user.id });
    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Also return the habits in this journey
    const habits = await ChallengeModel.find({ journeyId: id, userId: session.user.id });

    return NextResponse.json({ journey, habits });
  } catch (error) {
    console.error("Get journey error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, color, status } = await req.json();

    await connectDB();

    const journey = await JourneyModel.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, description, color, status },
      { new: true }
    );

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    return NextResponse.json(journey);
  } catch (error) {
    console.error("Update journey error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const journey = await JourneyModel.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Unlink habits from this journey (don't delete them)
    await ChallengeModel.updateMany(
      { journeyId: id, userId: session.user.id },
      { $unset: { journeyId: "" } }
    );

    return NextResponse.json({ message: "Journey deleted" });
  } catch (error) {
    console.error("Delete journey error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
