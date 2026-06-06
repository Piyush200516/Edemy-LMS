import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { contactSubmit } from "./controllers/adminController.js";

const app = express();

// Set security headers
app.use(helmet());

// Log requests in development
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// CORS settings
app.use(
    cors({
        origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    })
);

// Payload parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// Server ping check
app.use("/ping", (_req, res) => {
    res.status(200).send("Pong");
});

// Register routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

// General contact route
app.post("/api/v1/contact", contactSubmit);

// Fallback 404
app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Oops! Endpoint ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
