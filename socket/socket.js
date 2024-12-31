import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:['https://chatapp-frontend-iquh.onrender.com'],
        methods:['GET','POST','PUT','PATCH','DELETE'],
        credentials:true
    },
});
export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}
//for mapping userid->socketId
const userSocketMap={};
io.on("connection",(socket)=>{
    console.log(`User connected`,socket.id);
    const userId=socket.handshake.query.userId;
    console.log("user id in backend socket is:",userId)
    if(userId!=undefined){
        userSocketMap[userId]=socket.id;
    }
    // for online status to the frontend
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
    //for logout or disconnect
    socket.on('disconnect',()=>{
        console.log("User disconnected",socket.id);
        //remove from socketmap to remove the online status
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })

})

export {app,io,server};