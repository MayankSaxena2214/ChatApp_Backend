export class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=async(err,req,res,next)=>{
    err.message=err.message || "Internal Server Error";
    err.statusCode=err.statusCode || 500;

    console.log(err);
    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}