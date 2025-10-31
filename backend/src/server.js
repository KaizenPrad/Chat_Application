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

if(process.env.NODE_ENV==="production"){
   
    const FRONTEND_BUILD_PATH = path.resolve(__dirname, "frontend", "dist");


    app.use(express.static(FRONTEND_BUILD_PATH));


    app.get("*", (req, res)=>{
        // Use the clean path variable
        res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
    })
}



server.listen(PORT, ()=>{
    console.log(`server is running on port http://localhost:${PORT}`)
    connectDB();
})