import mongoose from "mongoose";
const Schema= mongoose.Schema;

//Schema for baseModels
const baseModelSchema=new Schema({
    modelName:{
        type:String,
        required:true,
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
    designParameters:{
        type:[
            {
                parameter:{type:String,required:true},
                upperLimit:{type:Number,required:true},
                lowerLimit:{type:Number,required:true}
            }
        ],
        default:[]
    },
    calcParams:{
        type:[
            {
                compName:{type:String,required:true},
                comp:{type:String,required:true}
            }
        ],
        default:[]
    },
    relations:{
        type:[String],
        required:true,
        default:[]
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
