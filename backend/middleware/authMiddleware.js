import jwt from "jsonwebtoken";
import { Pool } from 'pg';
import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError("Unauthorized, please login again", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = decoded;
        next();
    } catch (e) {
        return next(new AppError("Invalid or expired session, login again", 401));
    }
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    };
};

export const authorizeSubscribers = asyncHandler(async (req, res, next) => {
    const { rows } = await pool.query('SELECT role, subscription_status FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    if (user.role !== 'ADMIN' && user.subscription_status !== 'active') {
        return next(new AppError('Please subscribe to access this course!', 403));
    }
    next();
});
