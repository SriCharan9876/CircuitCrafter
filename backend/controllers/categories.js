import Category from "../models/category.js"

export const index=async (req,res)=>{ 
    const allCategories=await Category.find({});
    res.json({allCategories:allCategories});
}

export const createCategory=async (req,res)=>{

    const categoryData=req.body.categoryData;

    // const categoryData={
    //     name:"filter",
    //     label:"Filters",
    //     description:"Filter given signal"
    // }

    const newCategory=new Category(categoryData);
    await newCategory.save();
    console.log("New category created");
    console.log(newCategory);

    res.send("Created a new category");
}//Admin