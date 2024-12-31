import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    let {receiverId}=req.params;
    const {message}=req.body;
    const senderId=req.user.id;

    
    if(!receiverId || !senderId || !message){
        return next(new ErrorHandler("All fields are mandatory, senderId, receiverId and message",400));
    }
    receiverId=new mongoose.Types.ObjectId(receiverId);
    let getConversation=await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
    });
    if(!getConversation){
        //conversation not exist , so create it
        getConversation=await Conversation.create({
            participants:[senderId,receiverId],

        });
        
    }
    const newMessage=await Message.create({
        senderId,
        receiverId,
        message
    });
    if(!newMessage){
        return next(new ErrorHandler("Cannot send message",400));   
    }
    getConversation.messages.push(newMessage._id);
    await getConversation.save();

    // Here we will implement the socket.io later after frontend
    //fetch the receiversocketid
    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage);
    }
    return res.status(200).json({
        success:true,
        message:"Message sent successfully",
        getConversation,
        newMessage
    })

});

export const getMessage=catchAsyncErrors(async(req,res,next)=>{
    let {receiverId}=req.params;
    const senderId=req.user.id;
    const conversation=await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
    });
    if(!conversation){
        return res.status(200).json({
            success:true,
            messages:[]
        })
    }
    await conversation.populate("messages");
    return res.status(200).json({
        success:true,
        messages:conversation.messages
    })
})