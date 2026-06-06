import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectToDB from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import initSocket from "./src/socket/index.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5014;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy_cloud",
    api_key: process.env.CLOUDINARY_API_KEY || "dummy_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_secret"
});

// Create HTTP server and attach Socket.IO
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, async () => {
    // Connect to database
    await connectToDB();
    console.log(`LMS Server running in ${process.env.NODE_ENV || "development"} mode on port http://localhost:${PORT}`);
});
import app from "./app.js";
import connectToDB from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5014;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy_cloud",
    api_key: process.env.CLOUDINARY_API_KEY || "dummy_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_secret"
});

app.listen(PORT, async () => {
    // Connect to database
    await connectToDB();
    console.log(`LMS Server running in ${process.env.NODE_ENV || "development"} mode on port http://localhost:${PORT}`);
});
