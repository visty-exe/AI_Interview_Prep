import SkillGap from "../models/SkillGap.js";
import generateSkillGap from "../services/aiSkillGapGenerator.js";
import User from "../models/User.js"
import Interview from "../models/Interview.js"
import CodingInterview from "../models/CodingInterview.js"

export const generateUserSkillGap = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const interviews = await Interview.find({
            user: req.user.id
        })

        const evaluatedInterviews = interviews.filter((item) => item.overallScore > 0)

        const interviewScores = evaluatedInterviews.map((item) => item.overallScore)

        const interviewPerformance = {
            totalAttempts: interviews.length,
            averageScore: interviewScores.length > 0 ?
                Number((interviewScores.reduce((sum, score) => sum + score, 0) / interviewScores.length).toFixed(2)) : 0,
            higestScore: interviewScores.length > 0 ? Math.max(...interviewScores) : 0
        }

        const codingInterviews = await CodingInterview.find({
            user: req.user.id
        });

        const evaluatedCoding = codingInterviews.filter((item) => item.score > 0)

        const codingScores = evaluatedCoding.map((item) =>
            item.score
        )

        const codingPerformance = {
            totalAttempts: codingInterviews.length,
            averageScore: codingScores.length > 0 ? Number((codingScores.reduce((sum, score) => sum + score, 0) / codingScores.length).toFixed(2)) : 0,
            highestScore: codingScores.length > 0 ? Math.max(...codingScores) : 0
        }

        const aiResponse = await generateSkillGap({
            targetRole: user.targetRole,
            skills: user.skills,
            resumeAnalysis: user.resumeAnalysis,
            interviewPerformance,
            codingPerformance
        })

        console.log("AI SKILL GAP RESPONSE:");
        console.log(aiResponse);

        const jsonStart = aiResponse.indexOf("{")
        const jsonEnd = aiResponse.lastIndexOf("}")

        if (jsonStart === -1 || jsonEnd === -1) {
            return res.status(500).json({
                message: "AI returned invalid skill gap format"
            });
        }

        const cleanResponse = aiResponse
            .slice(jsonStart, jsonEnd + 1)
            .trim()

        const analysis = JSON.parse(cleanResponse)
        const skillGap = await SkillGap.findOneAndUpdate(
            {
                user: user._id
            },
            {
                user: user._id,
                targetRole: user.targetRole || "Software Engineer",
                strongSkills: analysis.strongSkills || [],
                weakSkills: analysis.weakSkills || [],
                missingSkills: analysis.missingSkills || [],
                recommendations: analysis.recommendations || []
            },
            {
                new: true,
                upsert: true
            }

        )
        res.status(200).json({
            message: "Skill gap analysis generated successfully",
            skillGap
        });

    } catch (error) {
        console.error(
            "Skill gap analysis error:",
            error
        );

        res.status(500).json({
            message: "Could not generate skill gap analysis"
        });
    }
};


export const getUserSkillGap = async (req, res) => {
    try {
        const skillGap = await SkillGap.findOne({
            user: req.user.id
        })
        if (!skillGap) {
            return res.status(404).json({
                message: "Skill gap analysis not found"
            });
        }

        res.status(200).json({
            skillGap
        });

    } catch (error) {
        console.error(
            "Get skill gap error:",
            error
        );

        res.status(500).json({
            message: "Could not fetch skill gap"
        });
    }
};