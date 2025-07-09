import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
dotenv.config();

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
    res.status(201).json({ message: "User created" }); 
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
        role: user.role
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
        role: user.role
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