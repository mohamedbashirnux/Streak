import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export const runtime = "nodejs";

// GET method - Shows instructions
export async function GET() {
  return NextResponse.json({
    message: "⚠️ Database Cleanup Endpoint",
    warning: "This will DELETE ALL DATA from your database!",
    instructions: "To clean the database, send a DELETE request to this endpoint",
    methods: {
      browser: "You cannot use browser directly. Use the button below or curl command.",
      curl: "curl -X DELETE http://localhost:3000/api/cleanup",
      fetch: `fetch('/api/cleanup', { method: 'DELETE' }).then(r => r.json()).then(console.log)`
    },
    note: "Add ?confirm=yes to the URL and refresh to execute cleanup"
  });
}

// DELETE method - Actually cleans the database
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
