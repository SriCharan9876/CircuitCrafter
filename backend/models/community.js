import mongoose from "mongoose";
import { mainDB } from "../config/db.js";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  topics: [
    {
      type: String,
      trim: true
    }
  ],
  people: [
    {
      type: String,
      trim: true
    }
  ],
  posts: [
    {
      type: String,
      trim: true
    }
  ],
  models: [
    {
      type: String,
      trim: true
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const Post = mainDB.model("Post", postSchema);
export default Post;