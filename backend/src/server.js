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


// src/server.js

// ... (existing imports and code up to app.use(cors...))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if (process.env.NODE_ENV === "production") {
    
    // Define the absolute path to the frontend build directory
    // We'll revert to the simpler relative path in resolve for robustness on Render
    const FRONTEND_DIST_PATH = path.resolve(__dirname, '..', 'frontend', 'dist');

    // 1. Serve static assets
    app.use(express.static(FRONTEND_DIST_PATH));

    // 2. CATCH-ALL ROUTE FIX: Use an anonymous middleware function on '/'
    // to reliably catch all GET requests not handled by API routes or static assets.
    app.use((req, res, next) => {
        // Only target GET requests that haven't been matched by other routes
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            // Send the index.html file
            res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
        } else {
            // Otherwise, move on (for POST/PUT/DELETE requests or API calls)
            next();
        }
    });
}


server.listen(PORT, ()=>{
    console.log(`server is running on port http://localhost:${PORT}`)
    connectDB();
})