const mongoose=require('mongoose');
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
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const User=mongoose.model("User",userSchema);
module.exports=User;