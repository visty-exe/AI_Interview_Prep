import mongoose from 'mongoose'

const codingInterviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    language: {
        type: String,
        enum: ["java"],
        default: "jave"
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    question: {
        title: String,
        description: String,
        input: String,
        output: String,
        constraints: [String]
    },
    code: {
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const CodingInterview= mongoose.model("CodingInterview",codingInterviewSchema)
export default CodingInterview