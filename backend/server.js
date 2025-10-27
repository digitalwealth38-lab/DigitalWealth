import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js" 
import homeRoutes from "./routes/homeRoutes.js" 
import userRoutes from"./routes/userRoutes.js"
import depositRoutes from "./routes/depositRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import packagesRoutes from "./routes/packagesRoutes.js"
import withdrawalRoutes from "./routes/withdrawalRoutes.js"

import {restrictToLoggedinUserOnly} from "./middleware/auth.middleware.js"
import {connectDB} from "./lib/db.js"

dotenv.config()
const app= express()
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
const PORT=process.env.PORT || 5000
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/users",restrictToLoggedinUserOnly,userRoutes);
app.use("/api/user",restrictToLoggedinUserOnly,depositRoutes);
app.use("/api/packages",restrictToLoggedinUserOnly,packagesRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/admin",adminRoutes);
app.listen(PORT,()=>{
    console.log("server is running",PORT)
    
     connectDB()
     

     
})