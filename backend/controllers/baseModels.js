import BaseModel from '../models/baseModel.js';

export const index=async(req,res)=>{
    try{
        const allModels=await BaseModel.find({}).populate("createdBy");
        return res.json({message:"Success",allModels:allModels});
    }catch(err){
        console.log(err);
        return res.json({message:"Error"});
    }
}//To show all listings

export const createModel=async(req,res)=>{
    console.log(req.user);
    try{
        const formData=req.body;
        const newmod={
            ... formData,
            createdBy:req.user.userId
        }
        console.log("New model added successfully:");
        console.log(newmod);
        const new_model=new BaseModel(newmod);
        await new_model.save();
        return res.json({added:true,message:"Successfully added"});
    }catch(err){
        console.log(err);
        return res.json({added:false,message:"failed to add"});
    }
}//to Add Model

export const getModel=async(req,res)=>{
    try{
        const {id}=req.params;
        const pmodel=await BaseModel.findById(id).populate("createdBy");
        return res.json({found:true,pmodel:pmodel});
    }catch(err){
        console.log(err);
        return res.json({found:false});
    }
}//To show a model

export const deleteModel=async(req,res)=>{
    res.send("Delete model");
}//To delete model

export const getPendingModels= async (req,res)=>{
    res.send("List all pending models");
};//to Show all pending models for admin (to be accepted or rejected)

export const getMyModels=async(req,res)=>{
    res.send("Get models created by user");
};//to show models created by current user for user

export const approveModel=(req,res)=>{
    res.send("Approve a user-submitted model");
};// to approve pending model created by user (access to admin)