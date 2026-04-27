import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export const runtime = "nodejs";

// WARNING: This will delete ALL data from the database!
export async function DELETE() {
  try {
    const session = await auth();
    
    // Optional: Only allow authenticated users to clean database
    // Remove this check if you want to allow anyone to clean
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Get all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      return NextResponse.json({ 
        message: "Database is already clean!",
        collectionsDropped: []
      });
    }

    // Drop all collections
    const droppedCollections: string[] = [];
    for (const collection of collections) {
      await db.dropCollection(collection.name);
      droppedCollections.push(collection.name);
    }

    return NextResponse.json({
      message: "🎉 Database cleaned successfully!",
      collectionsDropped: droppedCollections,
      note: "All users, challenges, categories, and stats have been deleted."
    });

  } catch (error) {
    console.error("Database cleanup error:", error);
    return NextResponse.json({ 
      error: "Failed to clean database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
