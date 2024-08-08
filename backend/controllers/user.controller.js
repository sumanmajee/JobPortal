import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { ErrorHandler } from "../middlewares/error.middleware.js"
import { User } from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async(req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role,
            firstNiche,
            secondNiche,
            thirdNiche,
            coverLetter,
        } = req.body;

        if (!name || !email || !phone || !address || !password || !role) {
            return next(new ErrorHandler("All feilds are required.", 400));
        }

        if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return next(
                new ErrorHandler("Please provide your preferred job niches.", 400)
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("Email is already registered.", 400));
        }

        const userData = {
            name,
            email,
            phone,
            address,
            password,
            role,
            niches: {
                firstNiche,
                secondNiche,
                thirdNiche,
            },
            coverLetter,
        };

        if (req.files && req.files.resume) {
            const { resume } = req.files;
            if (resume) {
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath,{ 
                        folder: "Job_Seekers_Resume" 
                    });
                    if (!cloudinaryResponse || cloudinaryResponse.error) {
                        return next(
                            new ErrorHandler("Failed to upload resume to cloud.", 500)
                        );
                    }
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id,
                        url: cloudinaryResponse.url,
                    };
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume", 500));
                }
            }
        }

        const user = await User.create(userData)
        sendToken(user, 201, res, "User Registered")
    } catch (error) {
        next(error)
    }
})

export const login = catchAsyncError(async (req, res, next) => {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
    return next(
        new ErrorHandler("Email, password and role are required.", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    if (user.role !== role) {
      return next(new ErrorHandler("Invalid user role.", 400));
    }
    sendToken(user, 200, res, "User logged in successfully.");
  });
