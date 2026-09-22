import "dotenv/config";

import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import interviewRoutes from "./routes/interviewRoutes.js";
import connectDB from "./config/db.js"
import codingInterviewRoutes from "./routes/codingInterviewRoutes.js";
import skillGapRoutes from "./routes/skillGapRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";


const app = express();

app.use(cors())
app.use(express.json())

connectDB()

const PORT = process.env.PORT || 3000

app.use('/api/auth', authRoutes)
app.use("/api/interviews", interviewRoutes);
app.use('/api/users', userRoutes)
app.use('/api/coding', codingInterviewRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);


app.get('/', (req, res) => {
    res.json({
        "success": true,
        "message": "API Is Working Fine"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})