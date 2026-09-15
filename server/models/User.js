import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["student","admin"],
        default: "student"
    },
    skills:{
        type:[String],
        default:[]
    },
    targetRole:{
        type: String,
        default: ""
    },
    resume:{
        type: String,
        default: ""
    },
    resumeAnalysis: {
    score: {
        type: Number,
        default: 0
    },

    skills: {
        type: [String],
        default: []
    },

    strengths: {
        type: [String],
        default: []
    },

    weaknesses: {
        type: [String],
        default: []
    },

    missingSkills: {
        type: [String],
        default: []
    },

    suggestions: {
        type: [String],
        default: []
    }
}
},{
    timeStamps: true
})

const User= mongoose.model("User",userSchema)
export default User