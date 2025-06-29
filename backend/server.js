import dotenv from 'dotenv';

//if(process.env.NODE_ENV!='production'){
    dotenv.config();
//}

import express from 'express';
import User from './models/user.js';
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
    "http://localhost:5173"
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

//Root directory................................................................
app.get("/",(req,res)=>{
    res.send("Root directory");
});

//Authentication routes............................................................
app.post("/api/auth/signup",(req,res)=>{
    res.send("User registration");
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

app.post("/api/auth/login",(req,res)=>{
    res.send("User login");
});

app.get("/api/auth/me",(req,res)=>{
    res.send("Get current user profile");
});//Auth User

//Categories routes............................................................
app.get("/api/categories",(req,res)=>{
    res.send("Fetch all available circuit categories");
});

app.post("/api/categories",(req,res)=>{
    res.send("Create a new category");
});//Admin

//  "/api/models?category=xyz"	route for fetching models under a specific category

//CircuitModels routes...............................................................
app.get("/api/models",(req,res)=>{
    res.send("Fetch all approved circuit models");
});

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