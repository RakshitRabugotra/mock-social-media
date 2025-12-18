import { Document } from "@/types";
import mongoose, { InferSchemaType, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      required: true
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
// Typeof User schema
export type User = Document & InferSchemaType<typeof userSchema>;

export default User;
