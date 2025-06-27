import mongoose, { Document, Model, Schema, Types } from "mongoose";

// User document interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
  photo?: string;
  idVerification?: object;
  profileComplete: boolean;
  lastReminderSent: Date | null;
  remindersSent: number;
  lastProfileUpdate: Date;
  customFields?: object;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    email: { type: String, unique: true },
    address: { type: String },
    password: { type: String },
    // role: { type: String, required: true },
    photo: { type: String },
    idVerification: {
      type: Object,
      default: null,
    },
    profileComplete: { type: Boolean, default: false },
    lastReminderSent: { type: Date, default: null },
    remindersSent: { type: Number, default: 0 },
    lastProfileUpdate: { type: Date, default: Date.now },
    customFields: { type: Object, default: {} },
  },
  { timestamps: true },
);

// Default username to email if none
userSchema.pre("validate", function (this: IUser, next) {
  if (!this.username) {
    this.username =
      this.email ||
      this.phone ||
      this.firstName + this.lastName ||
      this.firstName + this.lastName + Math.floor(Math.random() * 1000);
  }

  next();
});

// Export the model
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
