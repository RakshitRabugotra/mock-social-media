import { Document, Reference } from "@/types";
import mongoose, { InferSchemaType, models, Schema } from "mongoose";
import { User } from "./User";

const postSchema = new Schema(
  {
    feelingEmoji: {
      type: String,
      trim: true,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);
// Typeof Post schema
type RawPost = Document & InferSchemaType<typeof postSchema>;
// Some changes to make it more feasible to work with
export type Post = Omit<RawPost, "createdAt" | "updatedAt" | "owner"> & {
  owner: Reference<User>;
  createdAt: string;
  updatedAt: string;
};

// Create type for post
export type CreatePostDTO = Omit<
  Post,
  "createdAt" | "updatedAt" | "isDelete"
> & {
  owner: string;
};

export default Post;
