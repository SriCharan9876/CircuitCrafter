import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
import BaseModel from '../models/baseModel.js';
import sendOTP from "../config/mailer.js";
import Otp from "../models/otp.js";
import Post from "../models/community.js";

dotenv.config();
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const signup=async(req,res)=>{
    try {
    const { name,email,role,password,profilePic } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const new_user = new User({ name, email, password: hashedPassword,role,profilePic });
    await new_user.save();
    res.status(201).json({ message: "User created",added:true }); 
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).select("+password"); // include password manually

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedModels:user.savedModels
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove password before sending user
    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({ token, user: safeUser  });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({sent:false, message: "User already exists" });
    }

    const otp = generateOTP();

    await sendOTP(email, otp);

    await Otp.create({
      receiverEmail: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    });

    return res.status(200).json({ sent: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).json({ sent: false, message: "Failed to send OTP", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ receiverEmail: email });

    if (!record) {
      return res.status(400).json({ verified: false, message: "OTP not found" });
    }

    if (record.otp === otp && Date.now() < record.expiresAt) {
      await Otp.deleteOne({ receiverEmail: email }); // cleanup OTP
      return res.status(200).json({ verified: true });
    }

    return res.status(400).json({ verified: false, message: "Invalid or expired OTP" });

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({ verified: false, message: "Server error", error: error.message });
  }
};


export const getmydata = async (req, res) => {
    try {
        const userid = req.user.userId; // req.user is set by your auth middleware
        try{
            const userData=await User.findOne({_id:userid});
            return res.json({ fetched: true, me: userData });
        }catch(err){
            console.error("Error fetching current user details:", err);
            res.status(500).json({ fetched: false, message: "Failed to fetch user details" });
        }
        
    } catch (err) {
        console.error("Error fetching current user data:", err);
        res.status(500).json({ fetched: false, message: "Error fetching profile" });
    }
};

export const getAdminIds=async(req,res)=>{
  try{
    const adminArr=await User.find({role:"admin"}).select("_id");
    const adminIds = adminArr.map(admin => admin._id);
    res.status(200).json({ fetched:true, adminIds });    
  } catch (error) {
    res.status(500).json({ fetched:false, message: "Error fetching admin IDs" });
  }
}

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
export const googleLogin=async(req,res)=>{
  try{
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Generate a random dummy password (hashed)
      const randomPassword = googleId + Date.now(); // or crypto.randomBytes()
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        profilePic: {
          url: picture,
          public_id: "google-oauth", // or leave blank
        },
        googleId:googleId
      });
      await user.save();
    }
    const token2 = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedModels:user.savedModels
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: token2});
  }catch(err){
    console.log(err);
    return res.json({logged:false})
  }
}
export const getFavModels = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const favModels = await BaseModel.find({
      _id: { $in: user.savedModels },
    }).populate("createdBy");

    return res.json({ favModels, success: true });
  } catch (err) {
    console.error("Error fetching favorite models:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const saveModel = async (req, res) => {
  try {
    const { modelId } = req.body;
    const userId = req.user.userId; // token gives you only the userId

    if (!modelId) {
      return res.status(400).json({ success: false, message: "Model ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.savedModels.indexOf(modelId);

    if (index === -1) {
      user.savedModels.push(modelId);
      await user.save();
      return res.json({ success: true, message: "Model saved" });
    } else {
      user.savedModels.splice(index, 1);
      await user.save();
      return res.json({ success: true, message: "Model removed from saved list" });
    }

  } catch (err) {
    console.error("Error toggling saved model:", err);
    return res.status(500).json({ success: false, message: "Server error while saving model" });
  }
};
export const postNotifications = async (req, res) => {
  try {
    const { notifi } = req.body;
    const userId = req.user.userId;

    if (!notifi || !notifi.sender || !notifi.message || !notifi.roomId) {
      return res.status(400).json({ posted: false, error: "Invalid notification data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ posted: false, error: "User not found" });
    }

    user.notifications.push({
      sender: notifi.sender,
      message: notifi.message,
      roomId: notifi.roomId,
      time: notifi.time || Date.now(),
    });

    await user.save();

    return res.status(200).json({ posted: true });
  } catch (err) {
    console.error("Error posting notification:", err);
    return res.status(500).json({ posted: false, error: "Server error" });
  }
};

export const postNotificationsAllUsers = async (req, res) => {
  try {
    const { notifi } = req.body;

    if (!notifi || !notifi.sender || !notifi.message || !notifi.roomId) {
      return res.status(400).json({ posted: false, error: "Invalid notification data" });
    }

    // Create notification object
    const notificationData = {
      sender: notifi.sender,
      message: notifi.message,
      roomId: notifi.roomId,
      time: notifi.time || Date.now(),
    };
    if(notifi.receiverId){
      const id=notifi.receiverId;
      const user=await User.findById(id);
      if (!user || user.length === 0) {
        return res.status(404).json({ posted: false, error: "No users found" });
      }
      user.notifications.push(notificationData);
      await user.save();
    }else{
      const users = await User.find();

      if (!users || users.length === 0) {
        return res.status(404).json({ posted: false, error: "No users found" });
      }

      // Push notification to all users
      for (let user of users) {
        user.notifications.push(notificationData);
        await user.save();
      }
    }
    

    return res.status(200).json({ posted: true, message: "Notification sent accordingly" });

  } catch (err) {
    console.error("Error posting notification:", err);
    return res.status(500).json({ posted: false, error: "Server error" });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("notifications");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const notifications = [...user.notifications].sort((a, b) => b.time - a.time);

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { noteId } = req.body;
    console.log(noteId);

    if (!noteId) {
      return res.status(400).json({ success: false, error: "Notification ID required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const initialLength = user.notifications.length;
    user.notifications = user.notifications.filter(
      (note) => note._id.toString() !== noteId
    );

    if (user.notifications.length === initialLength) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      notifications: [...user.notifications].sort((a, b) => b.time - a.time),
    });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const checkExist = async (req, res) => {
  try {
    const { value } = req.params;
    console.log("value: ",value)
    const user = await User.findOne({ name: value });

    if (!user) {
      return res.json({ exist: false });
    } else {
      return res.json({ exist: true ,user:user});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const user = req.user;
    await BaseModel.deleteMany({ createdBy: user.userId });
    await Post.deleteMany({ author: user.userId });
    await User.findByIdAndDelete(user.userId);
    return res.json({ success: true, message: "Account and related data deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success:false,error: "Failed to delete account" });
  }
};
