import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["technical", "hr"],
        required: true
    },
    targetRole: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    questions: [
        {
            question: String,
            answer: {
                type: String,
                default: ""
            },
            feedback: {
                type: String,
                default: ""
            },
            score: {
                type: Number,
                default: 0
            }
        }
    ],

    overallScore:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

const Interview = mongoose.model("Interview", interviewSchema)
export default Interview