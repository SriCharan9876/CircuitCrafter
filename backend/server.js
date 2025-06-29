import dotenv from 'dotenv';
import Category from "./models/category.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import session from 'express-session';
import BaseModel from './models/baseModel.js';
import auth from './auth.js';
//if(process.env.NODE_ENV!='production'){
    dotenv.config();
//}

import express from 'express';
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.set("trust proxy", 1);
const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        domain:"localhost:5000",
        maxAge:7 * 24 * 60 * 60 * 1000,
    },
};
const allowedOrigins=[
    "http://localhost:5173",
    "http://localhost:5174"
]
app.use(cors({
    origin:(origin,callback)=>{
        console.log("CORS request from:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}))
app.use(session(sessionOptions));
const port=5000;
const JWT_SECRET=process.env.JWT_SECRET;
import connectDB from './config/db.js';
connectDB();


app.listen(port,()=>{
    console.log("Server started at port ",port)
});

//Authentication routes............................................................
app.post("/api/auth/signup",async(req,res)=>{
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
});

app.get("/demoSignup",async(req,res)=>{
    try{
        const details={
            name:"admin",
            email:"admin@xyz.com",
            password:"xyz",
            role:"admin",
        }
        const new_user=new User(details);
        await new_user.save();
        console.log("user created")
        res.send("user created")
        // alert("user created");
    }catch(err){
        console.log("error occured")
    }
    
})

app.post("/api/auth/login", async (req, res) => {
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
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ token });
});


app.get("/api/auth/me",(req,res)=>{
    res.send("Get current user profile");
});//Auth User

//Categories routes............................................................
app.get("/api/categories",async (req,res)=>{ 
    const allCategories=await Category.find({});
    res.json({allCategories:allCategories});
});

app.post("/api/categories",async (req,res)=>{

    //const categoryData=req.body.categoryData;

    const categoryData={
        name:"amplifier",
        label:"Amplifiers",
        description:"Amplify signal"
    }

    const newCategory=new Category(categoryData);
    await newCategory.save();
    console.log("New category created");
    console.log(newCategory);

    res.send("Created a new category");
});//Admin

//  "/api/models?category=xyz"	route for fetching models under a specific category

//CircuitModels routes...............................................................
app.get("/getModels",async(req,res)=>{
    try{
        const allModels=await BaseModel.find({});
        return res.json({message:"Success",allModels:allModels});
    }catch(err){
        console.log(err);
        return res.json({message:"Error"});
    }
});

app.post("/addModel",auth,async(req,res)=>{
    try{
        const formData=req.body;
        const newmod={
            ... formData,
            createdBy:req.user.userId
        }
        console.log(newmod)
        const new_model=new BaseModel(newmod);
        await new_model.save();
        return res.json({added:true,message:"Successfully added"});
    }catch(err){
        console.log(err);
        return res.json({added:false,message:"failed to add"});
    }
})

app.get("/api/models/:id",(req,res)=>{
    res.send("Get a specific model by ID");
});

app.post("/api/models",(req,res)=>{
    res.send("User submits new model (defaults approved: false)");
});//Auth User	

app.get("/api/models/pending",(req,res)=>{
    res.send("List all pending models");
});//Admin	

app.put("/api/models/:id/approve",(req,res)=>{
    res.send("Approve a user-submitted model");
});//Admin	

app.delete("/api/models/:id",(req,res)=>{
    res.send("Delete model");
});//Admin	

//Circuit generation routes (for client usage of models)
app.post("/api/generate",(req,res)=>{
    res.send("Generate circuit from user input");
});//Auth User

app.get("/api/download",(req,res)=>{
    res.send("Download generated circuit file");
});//Auth User

//User specified routes
app.get("/api/my-models",(req,res)=>{
    res.send("Get models created by user");
});//Auth User

// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="Some error occured"}=err;
//     res.status(401).json({message:"error occured"});
//     // res.status(statusCode).render("error.ejs",{message});
// });

//Root directory................................................................
app.get("/",(req,res)=>{
    res.send("Root directory");
});
