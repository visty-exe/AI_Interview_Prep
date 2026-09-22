import mongoose from "mongoose"
const LearningRoadmapSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetRole: {
        type: String,
        required: true
    },
    roadmap: [
        {
            phase: {
                type: Number,
                required: true
            },
            title: {
                type: String,
                required: true
            },

            skills: {
                type: [String],
                default: []
            },

            topics: {
                type: [String],
                default: []
            },

            priority: {
                type: String,
                enum: ["high", "medium", "low"],
                default: "medium"
            },
            estimatedTime: {
                type: String,
                default: ""
            }
        }
    ]
},{
    timestamps: true
})

const LearningRoadmap = mongoose.model("LearningRoadmap", LearningRoadmapSchema)

export default LearningRoadmap