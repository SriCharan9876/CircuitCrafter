import dotenv from 'dotenv';
//if(process.env.NODE_ENV!='production'){
    dotenv.config();
//}

import cors from "cors";
import session from 'express-session';

import categoryRouter from './routes/category.js';
import baseModelRouter from './routes/baseModel.js';
import authenticationRouter from './routes/auth.js';
import filesRouter from './routes/files.js';
import communityRouter from "./routes/community.js";
// import userRouter from "./routes/user.js";
// import modelRouter from"./routes/baseModel.js";


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
    "http://localhost:5174",
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
import connectDB from './config/db.js';
connectDB();


app.listen(port,()=>{
    console.log("Server started at port ",port)
});

//Authentication routes............................................................
app.use("/api/auth",authenticationRouter);//for signup, login,.. authenticationrelated routes

//Handling backend routes............................................................
app.use("/api/categories",categoryRouter);
app.use("/api/models",baseModelRouter);
//  "/api/models?category=xyz"	route for fetching models under a specific category
	
//File handling routes (for client usage of models)
app.use("/api/files",filesRouter);
app.use("/community",communityRouter);


// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="Some error occured"}=err;
//     res.status(401).json({message:"error occured"});
//     // res.status(statusCode).render("error.ejs",{message});
// });

// Add this near your other imports
import BaseModel from './models/baseModel.js'; // adjust path as needed

app.get('/dev/addviews', async (req, res) => {
  try {
    const models = await BaseModel.find();

    const updates = models.map(async (model) => {
      if (!Array.isArray(model.views)) {
        model.views = [model.createdBy]; // add owner as initial liker
        await model.save();
      }
    });

    await Promise.all(updates);

    res.status(200).send("Likes field added to all models successfully.");
  } catch (err) {
    console.error("Error adding likes:", err);
    res.status(500).send("Error updating models.");
  }
});

//Root directory................................................................
app.get("/",(req,res)=>{
    res.send("Root directory");
});
