import User from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (req, res, next) => {
    const allUsersCount = await User.countDocuments();
    const subscribedUsersCount = await User.countDocuments({
        "subscription.status": "active"
    });

    res.status(200).json({
        success: true,
        message: "Dashboard stats",
        allUsersCount,
        subscribedUsersCount
    });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        message: "All users list",
        users
    });
});

export const contactSubmit = asyncHandler(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError("All fields are required", 400));
    }

    const contact = await Contact.create({ name, email, message });

    if (!contact) {
        return next(new AppError("Submission failed, please try again", 400));
    }

    res.status(200).json({
        success: true,
        message: "Form submitted successfully"
    });
});
