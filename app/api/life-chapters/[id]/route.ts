import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import LifeChapterModel from "@/models/LifeChapter";

export const runtime = "nodejs";

// GET - Get specific life chapter
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
    const chapter = await LifeChapterModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!chapter) {
      return NextResponse.json({ error: "Life chapter not found" }, { status: 404 });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("Get life chapter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete life chapter
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
    const chapter = await LifeChapterModel.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!chapter) {
      return NextResponse.json({ error: "Life chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Life chapter deleted successfully" });
  } catch (error) {
    console.error("Delete life chapter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}