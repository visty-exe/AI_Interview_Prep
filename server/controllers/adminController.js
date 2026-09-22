
import User from "../models/User.js";
import Interview from "../models/Interview.js";
import CodingInterview from "../models/CodingInterview.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalInterviews = await Interview.countDocuments();

        const totalCodingAttempts =
            await CodingInterview.countDocuments();

        const interviews = await Interview.find({
            overallScore: { $gt: 0 }
        });

        const interviewScores = interviews.map(
            (item) => item.overallScore
        );

        const averageInterviewScore =
            interviewScores.length > 0
                ? Number(
                    (
                        interviewScores.reduce(
                            (sum, score) => sum + score,
                            0
                        ) / interviewScores.length
                    ).toFixed(2)
                )
                : 0;

        const codingInterviews = await CodingInterview.find({
            score: { $gt: 0 }
        });

        const codingScores = codingInterviews.map(
            (item) => item.score
        );

        const averageCodingScore =
            codingScores.length > 0
                ? Number(
                    (
                        codingScores.reduce(
                            (sum, score) => sum + score,
                            0
                        ) / codingScores.length
                    ).toFixed(2)
                )
                : 0;

        const recentUsers = await User.find({
            role: "student"
        })
            .select("name email targetRole createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentInterviews = await Interview.find()
            .populate("user", "name email")
            .select(
                "user type targetRole difficulty overallScore createdAt"
            )
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalStudents,
            totalInterviews,
            totalCodingAttempts,
            averageInterviewScore,
            averageCodingScore,
            recentUsers,
            recentInterviews
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);

        res.status(500).json({
            message: "Could not fetch admin dashboard"
        });
    }
};
