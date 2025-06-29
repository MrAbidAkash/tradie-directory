import { NextResponse } from "next/server";
import Listings from "@/models/listing";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import { getGHLContactDetails, setGHLField } from "@/lib/ghl";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { validateBusinessCredentials } from "@/lib/ai-validation";

export async function POST(req: Request) {
  try {
    const { contactId, listingData } = await req.json();

    // Basic validations
    if (!listingData.name || !listingData.name.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 },
      );
    }

    console.log("Listing Data yy:", listingData);
    
    
    
    // Add this validation before ABN check
    if (!listingData.services || listingData.services.length === 0) {
      return NextResponse.json(
        { error: "At least one service is required" },
        { status: 400 },
      );
    }

    // Add this validation before ABN check
    if (!listingData.regions || listingData.regions.length === 0) {
      return NextResponse.json(
        { error: "At least one service region is required" },
        { status: 400 },
      );
    }



    // ABN Validation
    if (!listingData.abn) {
      return NextResponse.json({ error: "ABN is required" }, { status: 400 });
    }

    // Clean ABN (remove spaces)
    const cleanedAbn = listingData.abn.replace(/\s/g, "");
    if (cleanedAbn.length !== 11 || !/^\d{11}$/.test(cleanedAbn)) {
      return NextResponse.json(
        { error: "ABN must be 11 digits" },
        { status: 400 },
      );
    }

    // Extract file paths from objects
    if (listingData.files) {
      // Handle different file structures
      listingData.files = listingData.files
        .map((file: any) => {
          if (typeof file === "string") return file;
          if (file?.path && typeof file.path === "string") return file.path;
          if (file?.url && typeof file.url === "string") return file.url;
          if (file?.name && typeof file.name === "string")
            return `/uploads/${file.name}`;
          return null;
        })
        .filter(Boolean)
        .filter((path: string) => path.startsWith("/"));
    } else {
      listingData.files = [];
    }

    // AI Business Credential Validation
    const validationResult = await validateBusinessCredentials(listingData);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          error: "Business credential validation failed",
          details: validationResult.message,
        },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    const mongoose = await connectToDatabase();

    if (!mongoose) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    // Get GHL Contact Details
    let getGHLContactDetail: any;
    let getGHLContactDetailZ: any;

    try {
      getGHLContactDetail = await getGHLContactDetails(contactId);
      getGHLContactDetailZ = getGHLContactDetail.contact;
    } catch (error) {
      console.error("Failed to set GHL field:", error);
    }

    // 1. First handle the user
    let user = await User.findOne({ email: getGHLContactDetailZ.email });
    let plainPassword = "";
    let isNewUser = false;

    // Create new user if doesn't exist
    if (!user) {
      plainPassword = uuidv4().slice(0, 10).replace(/-/g, "");
      const hashedPassword = await bcrypt.hash(plainPassword, 12);

      user = new User({
        firstName: getGHLContactDetailZ.firstName.split(" ")[0] || "Business",
        lastName:
          getGHLContactDetailZ.lastName.split(" ").slice(1).join(" ") ||
          "Owner",
        phone: getGHLContactDetailZ.phone,
        email: getGHLContactDetailZ.email,
        address: getGHLContactDetailZ.address || getGHLContactDetailZ.country,
        password: hashedPassword,
        verified: true,
        profileComplete: false,
        lastReminderSent: null,
        remindersSent: 0,
        customFields: getGHLContactDetailZ,
      });

      user = await user.save();
      isNewUser = true;
    }

    // 2. Handle listing - check for existing listing
    let listing = await Listings.findOne({ email: listingData.businessEmail });

    if (listing) {
      // Update existing listing
      listing.set({
        ...listingData,
        abn: cleanedAbn,
        user: user._id,
        ...(contactId && { contactId }),
      });
    } else {
      // Create new listing
      listing = new Listings({
        ...listingData,
        abn: cleanedAbn,
        status: "pending",
        user: user._id,
        ...(contactId && { contactId }),
      });
    }

    await listing.save();

    // 3. Handle GHL integration
    if (contactId) {
      try {
        await setGHLField(contactId, "FormCompleted");
      } catch (ghlError) {
        console.error("GHL update error:", ghlError);
      }
    }

    // 4. Send email to new users
    if (isNewUser && process.env.MAIL_FROM && process.env.MAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_FROM,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `Business Support <${process.env.MAIL_FROM}>`,
        to: user.email,
        subject: "Your Business Portal Access",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Our Portal!</h2>
          <p>Your business listing has been submitted and your account has been created.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Username:</strong> ${user.email}</p>
            <p><strong>Temporary Password:</strong> ${plainPassword}</p>
          </div>
          
          <p style="font-weight: bold; color: #ef4444;">
            Please change your password after first login.
          </p>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" 
            style="display: inline-block; background-color: #2563eb; color: white; 
                  padding: 12px 24px; text-decoration: none; border-radius: 4px;
                  font-weight: bold; margin-top: 16px;">
            Access Your Portal
          </a>
          
          <div style="margin-top: 24px; padding: 16px; background-color: #fffbeb; border-radius: 8px;">
            <h3 style="color: #d97706;">Next Steps</h3>
            <ul style="padding-left: 20px;">
              <li>Your listing is under review and will be approved within 24-48 hours</li>
              <li>Complete your business profile in the portal</li>
              <li>Set your service availability calendar</li>
            </ul>
          </div>
          
          <p style="margin-top: 24px; font-size: 0.9rem; color: #6b7280;">
            For security reasons, do not share this email with anyone.
          </p>
        </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      listingId: listing._id,
      userId: user._id,
      isNewUser,
      message:
        "Listing " +
        (listing ? "updated" : "submitted") +
        " successfully. " +
        (isNewUser
          ? "Check your email for login credentials."
          : "Awaiting approval."),
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
