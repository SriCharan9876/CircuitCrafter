import BaseModel from '../models/baseModel.js';

export const index=async(req,res)=>{
    const { category } = req.query;
    const filter=category?{typeName:category}:{}  //find({status:"approved"})
    filter.status="approved";
    try{
        const allModels=await BaseModel.find(filter).populate("createdBy");
        return res.json({message:"Success",allModels});
    }catch(err){
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Failed to fetch models" });
    }
}//To show all models

export const createModel=async(req,res)=>{
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

        if (!pmodel) {
            return res.status(404).json({ found: false, message: "Model not found" });
        }

        const currUser=req.user?.userId;
        if(currUser&&!pmodel.views.includes(currUser)){
            console.log(currUser);
            pmodel.views.push(currUser);
            await pmodel.save();
            console.log(pmodel.views);
        }
        console.log("pmodel: ",pmodel);
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
    const currUser=req.user.userId;
    const filter={createdBy:currUser};   

    try{
        const allModels=await BaseModel.find(filter).populate("createdBy");
        return res.json({message:"Success",allModels});
    }catch(err){
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Failed to fetch models" });
    }
};//to show models created by current user for user

export const updateModelStatus=async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body;
    const model=await BaseModel.findById(id);
    model.status=status;
    await model.save();
    return res.json({updated:true})
};// to approve pending model created by user (access to admin)

export const editModel = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const model = await BaseModel.findById(id);
        if (!model) {
            return res.status(404).json({ updated: false, message: "Model not found." });
        }

        // Update fields manually
        model.modelName = updatedData.modelName;
        model.typeName = updatedData.typeName;
        model.description = updatedData.description;
        model.fileUrl = updatedData.fileUrl;
        model.designParameters = updatedData.designParameters;
        model.calcParams = updatedData.calcParams;
        model.relations = updatedData.relations;

        // Conditionally update previewImg
        if (updatedData.previewImg && updatedData.previewImg.url) {
            model.previewImg = updatedData.previewImg;
        }

        await model.save();

        res.status(200).json({ updated: true, message: "Model updated successfully.", model });
    } catch (err) {
        console.error("Error updating model:", err);
        res.status(500).json({ updated: false, message: "Server error while updating model." });
    }
};

export const toggleLike=async (req,res)=>{
    const {id}=req.params;
    const userId = req.user.userId; 
    const model=await BaseModel.findById(id);
    if(!model){
        return res.status(404).json({message:"Model not found!"});
    }
    const hasLiked=model.likes.includes(userId);
    if(hasLiked){
        model.likes.pull(userId);
    }else{
        model.likes.push(userId);
    }

    await model.save();
    
    return res.status(200).json({
        message:hasLiked?"Unliked":"Liked",
        likesCount:model.likes.length
    })
}

export const updateViews=async(req,res)=>{
    const {id}=req.params;
    const userId=req.user.userId;
    const model=await BaseModel.findById(id);
    if(!model){
        return res.status(404).json({message:"Model not found!"});
    }
    const hasViewed=model.views.includes(userId);
    if(!hasViewed){
        model.views.push(userId);
        await model.save();
    }
}