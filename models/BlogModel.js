import { Schema, model } from "mongoose";

export const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required:true
  },
},{timestamps:true});

const BlogSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: false,
      default: "https://picsum.photos/1920/1080",
    },
    readTime: {
      value: {
        type: Number,
        required: false,
        default: 0,
      },
      unit: {
        type: String,
        required: false,
        default: "minutes",
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const BlogModel = model("Post", BlogSchema, "posts");

export default BlogModel;
