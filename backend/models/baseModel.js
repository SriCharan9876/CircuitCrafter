import mongoose from "mongoose";
const Schema= mongoose.Schema;

//Schema for baseModels
const baseModelSchema=new Schema({
    modelName:{
        type:String,
        required:true,
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    typeName: {
        type: String,
        required: true
    },
    description:String,
    fileUrl:{
        type:String,
        required:true
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    approved:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const BaseModel=mongoose.model("BaseModel",baseModelSchema);
export default BaseModel;
