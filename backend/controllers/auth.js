import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    try {
    const { name,email,role,password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const new_user = new User({ name, email, password: hashedPassword,role });
    await new_user.save();
    res.status(201).json({ message: "User created" }); 
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login=async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email:email });
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
            role:user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
}

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
