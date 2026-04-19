import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
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
    const challenge = await ChallengeModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Get challenge error:", error);
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
    const updates = await req.json();

    await connectDB();
    const challenge = await ChallengeModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    if (challenge.currentStreak > 0) {
      return NextResponse.json(
        { error: "Cannot edit a challenge that has started" },
        { status: 400 }
      );
    }

    const updatedChallenge = await ChallengeModel.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    return NextResponse.json(updatedChallenge);
  } catch (error) {
    console.error("Update challenge error:", error);
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
    const challenge = await ChallengeModel.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Challenge deleted" });
  } catch (error) {
    console.error("Delete challenge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
