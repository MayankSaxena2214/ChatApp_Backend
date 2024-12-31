import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  let { fullName, userName, password, email, gender, confirmPassword } =
    req.body;
  console.log(fullName, userName, password, email, gender, confirmPassword);

  if (
    !fullName ||
    !userName ||
    !password ||
    !email ||
    !gender ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("All fields are mandatory", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler(
        "Confirm password does not matched with the password",
        400
      )
    );
  }
  gender = gender.toLowerCase();
  email = email.toLowerCase();
  userName = userName.toLowerCase();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new ErrorHandler("User with this email already exists,kindly login", 400)
    );
  }
  password = await bcrypt.hash(password, 8);
  const randomAvatar = `https://avatar.iran.liara.run/public/girl/${gender?.toLowerCase()}?username=${userName}`;

  const user = await User.create({
    fullName,
    userName,
    password,
    email,
    profile: randomAvatar,
    gender,
  });
  return res.status(200).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  try{
    let { userName, password } = req.body;
  if (!userName || !password) {
    return next(new ErrorHandler("username and password are mandatory", 400));
  }
  userName = userName.toLowerCase();
  const user = await User.findOne({
    $or:[
      { userName },
      {email:userName}
    ]
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "User with this username does not exist, Kindly register",
        404
      )
    );
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Password", 400));
  }
  const token = await jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  res.cookie("token",token,{
    maxAge:60*24*60*60*1000,
    httpOnly:true,
    sameSite:'strict'
  })
  return res.status(200).json({
    success:true,
    message:"User Logged in successfully",
    user
  })
  }
  catch(error){
    console.log(error);
  }
  
});

export const logout=catchAsyncErrors(async(req,res,next)=>{
    //clear cookie
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"strict",
        
    });
    return res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })
});

export const getAllUsers=catchAsyncErrors(async(req,res,next)=>{
    //return all the user except the current user id
    const neglectId=req.user.id;
    const allUsers=await User.find({_id:{$ne:neglectId}}).select("-password");
    return res.status(200).json({
      success:true,
      allUsers
    })
})