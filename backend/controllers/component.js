import Component from "../models/component.js";

export const index=async(req,res)=>{
    try{
        const allComponents=await Component.find({approved:true}).populate("createdBy");
        return res.json({message:"Success",allComponents});
    }catch(err){
        console.error("Error fetching components:", err);
        res.status(500).json({ message: "Failed to fetch components" });
    }
}

export const allComponents=async(req,res)=>{
    try{
        const allComponents=await Component.find().populate("createdBy");
        return res.json({message:"Success",allComponents});
    }catch(err){
        console.error("Error fetching components:", err);
        res.status(500).json({ message: "Failed to fetch components" });
    }
}

export const createComponent=async(req,res)=>{
    try{
        const compdata=req.body;
        const newComponent=new Component({
            ... compdata,
            createdBy:req.user.userId
        });
        await newComponent.save();
        return res.json({added:true,message:"Successfully added",component:newComponent});
    }catch(err){
        console.log(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        return res.status(500).json({added:false,message:"server error"});
    }
}

export const deleteComponent=async(req,res)=>{
    try{
        const {compId}=req.params;
        await Component.findByIdAndDelete(compId);
        return res.json({deleted:true,message:"Component deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({ deleted: false, message: "Failed to delete Component" });
    }
}
