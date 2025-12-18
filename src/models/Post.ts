import { Document } from "@/types";
import mongoose, { InferSchemaType, models, Schema } from "mongoose";

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
export type Post = Document & InferSchemaType<typeof postSchema>;

export default Post;
