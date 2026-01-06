import mongoose from 'mongoose';
import { mainDB } from '../config/db.js';

const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true, // username of sender
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  roomId: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});
//Schema for users
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  // In user.js schema
  generatedFile: {
    public_id: String,
    url: String,
    baseModelId: { type: mongoose.Schema.Types.ObjectId, ref: "BaseModel" }
  },
  profilePic: {
    public_id: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: "https://res.cloudinary.com/du1tos77l/image/upload/v1751802026/profile_pics/bw7xgbtlukepm5gqleim.jpg"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  googleId: { type: String },
  savedModels: {
    type: [String],
    default: []
  },
  contributionCount: {
    type: Number,
    default: 0
  },
  notifications: {
    type: [notificationSchema],
    default: []
  }
});

const User = mainDB.model("User", userSchema);
export default User;