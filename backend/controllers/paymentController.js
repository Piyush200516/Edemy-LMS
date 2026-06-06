import crypto from "crypto";
import Razorpay from "razorpay";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Initialize Razorpay instance if key ID is present
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== "your_razorpay_key_id") {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

export const getRazorpayKey = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID || "mock_razorpay_key_id_lms_dev"
    });
});

export const subscribe = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("Unauthorized, please login again", 401));
    }

    if (user.role === "ADMIN") {
        return next(new AppError("Admin cannot purchase a subscription", 400));
    }

    if (user.subscription.status === "active") {
        return next(new AppError("You already have an active subscription", 400));
    }

    let subscription;
    if (razorpay) {
        try {
            subscription = await razorpay.subscriptions.create({
                plan_id: process.env.RAZORPAY_PLAN_ID,
                customer_notify: 1,
                total_count: 12 // 1 year duration (monthly bills)
            });
        } catch (e) {
            return next(new AppError(e.message, 500));
        }
    } else {
        // Mock subscription for local dev
        subscription = {
            id: `sub_mock_${Math.random().toString(36).substr(2, 9)}`,
            status: "created"
        };
    }

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Subscribed successfully",
        subscription_id: subscription.id
    });
});

export const verifyPayment = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("Unauthorized, please login again", 401));
    }

    // If Razorpay instance exists, check signature
    if (razorpay) {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return next(new AppError("Payment verification failed, signature mismatch", 400));
        }
    } else {
        console.log("Mock Mode: Skipping Payment Signature verification");
    }

    // Save payment record
    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature: razorpay_signature || "mock_signature"
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
        success: true,
        message: "Payment verified successfully"
    });
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("Unauthorized, please login again", 401));
    }

    if (user.role === "ADMIN") {
        return next(new AppError("Admin cannot cancel subscription", 400));
    }

    const subscriptionId = user.subscription.id;

    if (razorpay && subscriptionId && !subscriptionId.startsWith("sub_mock_")) {
        try {
            await razorpay.subscriptions.cancel(subscriptionId);
        } catch (e) {
            return next(new AppError(e.message, 500));
        }
    }

    user.subscription.status = "inactive";
    await user.save();

    res.status(200).json({
        success: true,
        message: "Subscription cancelled successfully"
    });
});

export const getPaymentRecord = asyncHandler(async (req, res, next) => {
    const { count } = req.query;
    const limit = count ? parseInt(count) : 10;

    const allPayments = await Payment.find({}).limit(limit);
    const countPayments = await Payment.countDocuments();

    // Mock dashboard metrics for sales visualization in the charts
    const monthlySalesRecord = [3, 5, 8, 12, 10, 15, 20, 25, 22, 30, 28, 35];

    res.status(200).json({
        success: true,
        message: "Payment history fetched successfully",
        allPayments: {
            count: countPayments
        },
        monthlySalesRecord,
        finalMonths: {
            "Jan": 3, "Feb": 5, "Mar": 8, "Apr": 12, "May": 10, "Jun": 15,
            "Jul": 20, "Aug": 25, "Sep": 22, "Oct": 30, "Nov": 28, "Dec": 35
        }
    });
});
