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
    previewImg: {
        public_id: { type: String },
        url: { type: String,
            default:"https://res.cloudinary.com/du1tos77l/image/upload/v1752053624/ChatGPT_Image_Jul_9_2025_03_01_00_PM-removebg-preview_ejn4b9.jpg"
        },
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
    status:{
        type:String,
        enum:["approved","rejected","pending"],
        default:"pending",
        required:true
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    views:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    designCount:{
        type:Number,
        default:0
    }
});

const BaseModel=mongoose.model("BaseModel",baseModelSchema);
export default BaseModel;
