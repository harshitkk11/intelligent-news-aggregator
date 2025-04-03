import mongoose, { Schema, Document } from "mongoose";

interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  verificationCode: string;
  verifyCodeExpiry: Date;
  isEmailVerified: boolean;
  passwordResetToken: string;
  passwordResetExpires: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

const usersSchema: Schema<UserType> = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: { type: String, required: true, select: false },
    avatar: {
      type: String,
      default: "",
    },
    verificationCode: { type: String, required: true },
    verifyCodeExpiry: { type: Date, required: true },
    isEmailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

const User =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>("User", usersSchema);

export { User };
export type { UserType };