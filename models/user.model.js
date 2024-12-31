import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    profile:{
        type:String,
        default:"https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg"
    },
    gender:{
        type:String,
        enum:["male","female","other"],
        required:true,
    }
},{timestamps:true});

export const User=mongoose.model("User",userSchema);