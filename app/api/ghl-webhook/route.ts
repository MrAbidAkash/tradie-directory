import connectToDatabase from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { db } = await connectToDatabase();

    // Log the webhook payload
    await db.collection("webhook-logs").insertOne({
      source: "gohighlevel",
      payload,
      receivedAt: new Date(),
    });

    console.log("GoHighLevel webhook received:", payload);

    // Process the webhook based on event type
    if (
      payload.type === "contact.created" ||
      payload.type === "contact.updated"
    ) {
      const contact = payload.data;

      // Map GoHighLevel contact to our listing format
      const listingData = {
        name: contact.companyName || `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        phone: contact.phone,
        service: contact.customFields?.service || "General Services",
        region: contact.customFields?.region || contact.city || "Not specified",
        abn: contact.customFields?.abn || "",
        status: "pending",
        source: "gohighlevel",
        ghlContactId: contact.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Upsert the listing
      await db
        .collection("listings")
        .updateOne(
          { ghlContactId: contact.id },
          { $set: listingData },
          { upsert: true },
        );

      console.log("Listing upserted from GoHighLevel webhook");
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Error processing GoHighLevel webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 },
    );
  }
}
