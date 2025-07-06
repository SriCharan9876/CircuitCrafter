import Category from "../models/category.js"

export const index=async (req,res)=>{
    try{
        const allCategories=await Category.find({});
        return res.json({allCategories:allCategories});
    }catch(err){
        console.log(err);
        return res.json({message:"Error"});
    }
    
}//To show all categories

export const createCategory=async (req,res)=>{
    try{
        const categoryData=req.body;
        const newCategory=new Category(categoryData);
        await newCategory.save();
        console.log("New category created");
        return res.json({added:true,message:"Successfully added"});
    }catch(err){
        console.log(err);
        return res.json({added:false,message:"failed to add"});
    }

}//Admin