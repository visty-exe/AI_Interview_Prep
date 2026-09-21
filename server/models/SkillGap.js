import mongoose from "mongoose"

const skillGapSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    targetRole: {
        targetRole: {
            type: String,
            required: true
        },

    },
    strongSkills: {
        type: [String],
        default: []
    },
    weakSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },

    recommendations: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

const SkillGap= mongoose.model("SkillGap",skillGapSchema)
export default SkillGap