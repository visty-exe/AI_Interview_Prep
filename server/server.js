import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./config/db.js"

dotenv.config()

const app= express();

app.use(cors())
app.use(express.json())

connectDB()

const PORT = process.env.PORT ||3000

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use("/uploads", express.static("uploads"));

app.get('/',(req,res)=>{
    res.json({
        "success": true,
        "message": "API Is Working Fine"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})