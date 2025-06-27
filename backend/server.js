import dotenv from 'dotenv';

//if(process.env.NODE_ENV!='production'){
    dotenv.config();
//}

import express from 'express';
const app=express();
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