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
        required:true,
        select:false
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
    profilePic: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/demo/image/upload/v1710000000/default-avatar.png"
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    googleId:{type:String}
});

const User=mongoose.model("User",userSchema);
export default User;