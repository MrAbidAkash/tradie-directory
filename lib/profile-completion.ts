import User from "@/models/user";
import Listings from "@/models/listing";
import { IListing } from "@/models/listing"; // Import the interface

// Define profile completion criteria with weights
const COMPLETION_CRITERIA = {
  BASIC_INFO: 0.2, // Business name, ABN, contact info
  SERVICE: 0.2, // Service type specified
  REGION: 0.15, // Region specified
  OPERATING_HOURS: 0.1, // Operating hours specified
  DESCRIPTION: 0.1, // Business description provided
  CREDENTIALS: 0.15, // Credentials provided
  PROFILE_PHOTO: 0.1, // Profile photo uploaded
};

export async function calculateProfileCompletion(userId: string) {
  const user = await User.findById(userId);
  if (!user) return 0;

  const listing = (await Listings.findOne({ user: userId })) as IListing | null;
  if (!listing) return 0;

  let score = 0;

  // Basic Info (20%)
  if (listing.name && listing.abn && listing.phone && listing.email) {
    score += COMPLETION_CRITERIA.BASIC_INFO;
  }

  // Service (20%)
  if (listing.service) {
    score += COMPLETION_CRITERIA.SERVICE;
  }

  // Region (15%)
  if (listing.region) {
    score += COMPLETION_CRITERIA.REGION;
  }

  // Operating Hours (10%)
  if (listing.operatingHours) {
    score += COMPLETION_CRITERIA.OPERATING_HOURS;
  }

  // Description (10%)
  if (listing.description) {
    score += COMPLETION_CRITERIA.DESCRIPTION;
  }

  // Credentials (15%)
  if (listing.credentials && listing.credentials.length > 0) {
    score += COMPLETION_CRITERIA.CREDENTIALS;
  }

  // Profile Photo (10%)
  if (user.photo) {
    score += COMPLETION_CRITERIA.PROFILE_PHOTO;
  }

  return Math.round(score * 100);
}

export async function isProfileComplete(userId: string) {
  const completion = await calculateProfileCompletion(userId);
  return completion >= 90; // 90% threshold for "complete"
}
