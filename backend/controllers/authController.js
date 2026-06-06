// Updated Auth Controller using PostgreSQL
import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

// Helper to generate JWT token
const generateToken = (user) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn: process.env.JWT_EXPIRY || "7d" });
};

export const register = asyncHandler(async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError("All fields are mandatory", 400));
    }
    // Check if user already exists
    const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0) {
        return next(new AppError("Email already exists", 409));
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Default avatar values
    let avatarPublicId = email;
    let avatarSecureUrl = "https://res.cloudinary.com/du9dxs6ac/image/upload/v1700000000/default_avatar.png";
    // Upload avatar if file provided
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill"
            });
            if (result) {
                avatarPublicId = result.public_id;
                avatarSecureUrl = result.secure_url;
            }
            await fs.rm(req.file.path);
        } catch (e) {
            console.error(`Cloudinary Upload Error: ${e.message}. Using default avatar.`);
            try { await fs.rm(req.file.path); } catch (_) {}
        }
    }
    const insertQuery = `INSERT INTO users (full_name, email, password_hash, avatar_public_id, avatar_secure_url, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name AS "fullName", email, role, avatar_public_id AS "avatarPublicId", avatar_secure_url AS "avatarSecureUrl"`;
    const values = [fullName, email, hashedPassword, avatarPublicId, avatarSecureUrl, "USER"];
    const { rows } = await pool.query(insertQuery, values);
    const user = rows[0];
    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("All fields are required", 400));
    }
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user) {
        return next(new AppError("Email or password does not match", 401));
    }
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
        return next(new AppError("Email or password does not match", 401));
    }
    const token = generateToken(user);
    // Remove password_hash before sending response
    delete user.password_hash;
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user
    });
});

export const logout = asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

export const getProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { rows } = await pool.query("SELECT id, full_name AS \"fullName\", email, role, avatar_public_id AS \"avatarPublicId\", avatar_secure_url AS \"avatarSecureUrl\" FROM users WHERE id = $1", [id]);
    const user = rows[0];
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user
    });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { fullName } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;
    if (fullName) {
        fields.push(`full_name = $${idx++}`);
        values.push(fullName);
    }
    // Avatar handling
    if (req.file) {
        try {
            const { rows: curRows } = await pool.query("SELECT avatar_public_id FROM users WHERE id = $1", [id]);
            const currentPublicId = curRows[0]?.avatar_public_id;
            if (currentPublicId && currentPublicId !== req.body.email) {
                await cloudinary.uploader.destroy(currentPublicId);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: "faces",
                crop: "fill"
            });
            if (result) {
                fields.push(`avatar_public_id = $${idx++}`);
                values.push(result.public_id);
                fields.push(`avatar_secure_url = $${idx++}`);
                values.push(result.secure_url);
            }
            await fs.rm(req.file.path);
        } catch (e) {
            console.error(`Cloudinary Update Error: ${e.message}`);
            try { await fs.rm(req.file.path); } catch (_) {}
        }
    }
    if (fields.length === 0) {
        return next(new AppError("No fields to update", 400));
    }
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, full_name AS \"fullName\", email, role, avatar_public_id AS \"avatarPublicId\", avatar_secure_url AS \"avatarSecureUrl\"`;
    values.push(id);
    const { rows } = await pool.query(query, values);
    const user = rows[0];
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    if (!oldPassword || !newPassword) {
        return next(new AppError("All fields are mandatory", 400));
    }
    const { rows } = await pool.query("SELECT password_hash FROM users WHERE id = $1", [id]);
    const user = rows[0];
    if (!user) {
        return next(new AppError("User does not exist", 400));
    }
    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
        return next(new AppError("Invalid old password", 400));
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, id]);
    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});
