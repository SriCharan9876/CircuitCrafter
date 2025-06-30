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

    console.log(req.user);
    try{
        const categoryData=req.body;
        if(req.user.role!="admin"){
            console.log("Only admin has access to create category.");
            return res.json({added:false,message:"failed to add"});
        }
        const newCategory=new Category(categoryData);
        await newCategory.save();
        console.log("New category created");
        console.log(newCategory);

        return res.json({added:true,message:"Successfully added"});
    }catch(err){
        console.log(err);
        return res.json({added:false,message:"failed to add"});
    }

}//Admin