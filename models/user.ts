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
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    // role: { type: String, required: true },
    photo: { type: String },
    idVerification: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true },
);

// Default username to email if none
userSchema.pre("validate", function (this: IUser, next) {
  if (!this.username) {
    this.username = this.email;
  }
  
  next();
});

// Export the model
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
