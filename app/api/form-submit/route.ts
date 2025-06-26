// app/api/form-submit/route.ts
import { NextResponse } from "next/server";
import Listings from "@/models/listing";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { listingData } = await req.json();

    // Connect to MongoDB
    const mongoose = await connectToDatabase();
    const db = mongoose.connection;

    // Create listing without requiring contactId
    const listing = new Listings({
      ...listingData,
      status: "pending",
    });

    await listing.save();

    return NextResponse.json({
      success: true,
      listingId: listing._id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
