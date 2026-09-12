import express from "express"
import cors from "cors"
import dotenv from "dotenv"
// import routes from "./routes/router.js"
import connectDB from "./config/db.js"

dotenv.config()

const app= express();

app.use(cors())
app.use(express.json())

connectDB()

const PORT = process.env.PORT ||3000

// app.use('/api',routes)
app.get('/',(req,res)=>{
    res.json({
        "success": true,
        "message": "API Is Working Fine"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})