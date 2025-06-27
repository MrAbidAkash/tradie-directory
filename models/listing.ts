import mongoose, { Document, Model, Schema, Types } from "mongoose";

// User document interface
export interface IListing {
  _id: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  service: string;
  region: string;
  phone: string;
  email: string;
  abn: string;
  description: string;
  operatingHours: string;
  serviceAreas: string[]; // Array of service area names or IDs
  credentials: string[]; // e.g., license numbers, image URLs, or doc names
  jobPreferences: {
    [key: string]: any; // Replace `any` with more specific type if known
  };
  rating: number;
  reviews: number;
  status: "active" | "inactive" | "pending"; // extend as needed
  fileUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new mongoose.Schema<IListing>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    service: { type: String, required: true },
    region: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    abn: { type: String, required: true },
    description: { type: String,},
    operatingHours: { type: String, required: true },
    serviceAreas: { type: [String], required: true },
    credentials: { type: [String], default: [] },
    jobPreferences: { type: Schema.Types.Mixed, default: {} },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    fileUrls: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Default username to email if none

// Export the model
const Listings: Model<IListing> =
  (mongoose.models.Listings as Model<IListing>) ||
  mongoose.model<IListing>("Listings", listingSchema);

export default Listings;
