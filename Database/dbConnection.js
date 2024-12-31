import mongoose from "mongoose";

export const dbConnection=async()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}`,{
        dbName:"CHAT_APP"
    })
    .then((result)=>{
        console.log("Mongo db connected");
    })
    .catch((error)=>{
        console.log(`Some error occured in connecting db ${error}`);
    })
}