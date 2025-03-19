import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./Database/dbConnection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import { userRouter } from "./routes/user.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { conversationRouter } from "./routes/conversation.routes.js";
import { app, server } from "./socket/socket.js";
dotenv.config({
    path:"./config/.env"
});

const port=process.env.PORT;

app.use(cookieParser());
app.use(cors({
    origin:'https://chatapp-frontend-iquh.onrender.com',
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// middlewares
dbConnection();

// setup the routes
app.use("/api/v1/users",userRouter);
app.use("/api/v1/messages",messageRouter);
app.use("/api/v1/conversation",conversationRouter)



app.use(errorMiddleware);
server.listen(port,()=>{
    console.log("Server is listening on port ",port)
})
// app.listen(port,()=>{
//     console.log(`App is listening on the port ${port}`);
// })
