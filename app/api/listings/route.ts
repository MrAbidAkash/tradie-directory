import connectToDatabase from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const listings = await db.collection("listings").find({}).toArray();

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

    // Auto-save functionality - upsert based on email or phone
    const filter = body.email ? { email: body.email } : { phone: body.phone };

    const result = await db.collection("listings").updateOne(
      filter,
      {
        $set: {
          ...body,
          updatedAt: new Date(),
          status: body.status || "draft",
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      id: result.upsertedId || "updated",
      message: "Listing saved successfully",
    });
  } catch (error) {
    console.error("Error saving listing:", error);
    return NextResponse.json(
      { error: "Failed to save listing" },
      { status: 500 },
    );
  }
}
