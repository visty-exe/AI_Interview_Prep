import User from "../models/User.js";
import SkillGap from "../models/SkillGap.js";
import LearningRoadmap from "../models/LearningRoadmap.js";
import generateRoadmap from "../services/aiRoadmapGenerator.js";

export const generateUserRoadmap = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const skillGap = await SkillGap.findOne({
            user: req.user.id
        })
        if (!skillGap) {
            return res.status(404).json({
                message:
                    "Please generate skill gap analysis first"
            });
        }

        const aiResponse = await generateRoadmap({
            targetRole: user.targetRole,
            skills: user.skills,
            resumeAnalysis: user.resumeAnalysis,
            skillGap
        })

        console.log("AI ROADMAP RESPONSE:");
        console.log(aiResponse);

        const jsonStart = aiResponse.indexOf("{")
        const jsonEnd = aiResponse.lastIndexOf("}")

        if (jsonStart === -1 || jsonEnd === -1) {
            return res.status(500).json({
                message: "AI returned invalid roadmap format"
            });
        }

        const cleanResponse = aiResponse
            .slice(jsonStart, jsonEnd + 1)
            .trim()

        const analysis = JSON.parse(cleanResponse)
        if (
            !analysis.roadmap ||
            !Array.isArray(analysis.roadmap)
        ) {
            return res.status(500).json({
                message: "Invalid roadmap data"
            });
        }

        const roadmap = await LearningRoadmap.findOneAndUpdate({
            user: req.user.id
        },
            {
                user: user._id,
                targetRole:
                    user.targetRole || "Software Engineer",
                roadmap: analysis.roadmap
            }, {
            new: true,
            upsert: true
        })
        res.status(200).json({
            message:
                "Learning roadmap generated successfully",
            roadmap
        });

    } catch (error) {
        console.error(
            "Generate roadmap error:",
            error
        );

        res.status(500).json({
            message:
                "Could not generate learning roadmap"
        });
    }
};

export const getUserRoadmap = async (req, res) => {
    try {
        const roadmap = await LearningRoadmap.findOne({
            user: req.user.id
        })
        if (!roadmap) {
            return res.status(404).json({
                message: "Learning roadmap not found"
            });
        }

        res.status(200).json({
            roadmap
        });
    } catch (error) {
        console.error("Get roadmap error:", error);

        res.status(500).json({
            message: "Could not fetch learning roadmap"
        });
    }
};