import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    // Check for token in headers or cookies
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new ErrorHandler("Token not found, not authenticated", 401));
    }
    // console.log(token);
    try {
        // Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user by ID in the token payload
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return next(new ErrorHandler("User with this ID not found", 404));
        }

        // Attach user info to the request object
        req.user = {
            id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
        };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});
