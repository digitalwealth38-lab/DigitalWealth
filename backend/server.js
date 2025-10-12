import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js" 
import userRoutes from"./routes/userRoutes.js"
import {restrictToLoggedinUserOnly} from "./middleware/auth.middleware.js"
import {connectDB} from "./lib/db.js"
dotenv.config()
const app= express()
app.use(cookieParser());
const PORT=process.env.PORT || 5000
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true
  })
);
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/users",restrictToLoggedinUserOnly,userRoutes);
app.listen(PORT,()=>{
    console.log("server is running",PORT)
    connectDB()
})