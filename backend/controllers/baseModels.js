import BaseModel from '../models/baseModel.js';

export const index=async(req,res)=>{
    const { category } = req.query;
    const filter=category?{typeName:category}:{}  //find({status:"approved"})
    filter.status="approved";
    console.log(filter);
    try{
        const allModels=await BaseModel.find(filter).populate("createdBy");
        return res.json({message:"Success",allModels});
    }catch(err){
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Failed to fetch models" });
    }
}//To show all models

export const createModel=async(req,res)=>{
    console.log(req.user);
    try{
        const finalData=req.body;
        const newmod={
            ... finalData,
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
    try{
        const {id}=req.params;
        const deletedModel=await BaseModel.findByIdAndDelete(id);
        console.log("Model deleted successfully: ");
        console.log(deletedModel);
        return res.json({deleted:true,message:"Model deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({ deleted: false, message: "Failed to delete model" });
    }
}//To delete model

export const getPendingModels= async (req,res)=>{
    const filter={status:"pending"};
    try{
        const allModels=await BaseModel.find(filter).populate("createdBy");
        return res.json({message:"Success",allModels});
    }catch(err){
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Failed to fetch models" });
    }
};//to Show all pending models for admin (to be accepted or rejected)

export const getMyModels=async(req,res)=>{
    res.send("Get models created by user");
};//to show models created by current user for user

export const updateModelStatus=(req,res)=>{
    res.send("Update status of a user-submitted model");
};// to approve pending model created by user (access to admin)