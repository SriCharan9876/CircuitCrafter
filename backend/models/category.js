import mongoose from "mongoose";
const Schema=mongoose.Schema;

//Schema for categories
const categorySchema=Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    label:{
        type:String,
        required:true
    },
    description:String
});

const Category= mongoose.model('Category',categorySchema);
export default Category;