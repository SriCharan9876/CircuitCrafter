import mongoose from 'mongoose';
const Schema=mongoose.Schema;

//Schema for users
const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    // In user.js schema
    generatedFile: {
        public_id: String,
        url: String,
        baseModelId: { type: mongoose.Schema.Types.ObjectId, ref: "BaseModel" }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const User=mongoose.model("User",userSchema);
export default User;