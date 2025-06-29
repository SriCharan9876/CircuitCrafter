import dotenv from 'dotenv';
//if(process.env.NODE_ENV!='production'){
    dotenv.config();
//}

import Category from "./models/category.js";
import User from "./models/user.js";
import cors from "cors";
import session from 'express-session';
import BaseModel from './models/baseModel.js';
import auth from './auth.js';

import categoryRouter from './routes/category.js';
import baseModelRouter from './routes/baseModel.js';
import authenticationRouter from './routes/auth.js'
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
const JWT_SECRET=process.env.JWT_SECRET;
import connectDB from './config/db.js';
connectDB();


app.listen(port,()=>{
    console.log("Server started at port ",port)
});

//Authentication routes............................................................
app.use("/api/auth",authenticationRouter);//for signup, login,.. authenticationrelated routes

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

//Handling backend routes............................................................
app.use("/api/categories",categoryRouter);
app.use("/api/models",baseModelRouter);
//  "/api/models?category=xyz"	route for fetching models under a specific category
	

//Circuit generation routes (for client usage of models)
app.post("/api/generate",(req,res)=>{
    res.send("Generate circuit from user input");
});//Auth User

app.get("/api/download",(req,res)=>{
    res.send("Download generated circuit file");
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
