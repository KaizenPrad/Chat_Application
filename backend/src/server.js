import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js";
import cors from "cors";

import path from "path";


import {app, server} from './lib/socket.js';

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";


const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

JavaScript

// src/server.js

// ... (existing imports and code up to app.use(cors...))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    
    // ⚠️ FIX 1: Define the absolute path to the frontend build directory
    // This is safer than relying on '..' with path.join.
    // Assuming 'frontend' is a sibling directory to 'backend'.
    const FRONTEND_DIST_PATH = path.resolve(__dirname, '..', 'frontend', 'dist');

    // 1. Serve static assets
    app.use(express.static(FRONTEND_DIST_PATH));

    // 2. Catch-all route (must be last)
    // This should be the line causing the error (now line 40 if you count correctly)
    app.get("*", (req, res) => {
        // Use the absolute path variable to send the file
        res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
    });
}



server.listen(PORT, ()=>{
    console.log(`server is running on port http://localhost:${PORT}`)
    connectDB();
})