import Interview from "../models/Interview.js";
import User from "../models/User.js";
import generateInterview from "../services/aiInterviewGenerator.js";

export const startInterview = async (req, res) => {
    try {
        const { type, difficulty } = req.body

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!type || !['technical', 'hr'].includes(type)) {
            return res.status(400).json({
                message: "Invalid interview type"
            });
        }

        const aiResponse = await generateInterview(
            user.targetRole || "Software Developer",
            type,
            difficulty || 'medium'
        )

        const cleanResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        // console.log("AI RESPONSE:");
        // console.log(aiResponse);


        const parsedResponse = JSON.parse(cleanResponse)

        // console.log("PARSED RESPONSE:");
        // console.log(parsedResponse);


        const questions = parsedResponse.questions.map(
            (question) => ({
                question: question
            })
        );
        
        const interview = await Interview.create({
            user: user._id,
            type,
            targetRole: user.targetRole || "Software Developer",
            difficulty: difficulty || "medium",
            questions
        })
        res.status(201).json({
            message: "Interview started successfully",
            interview
        });

    } catch (error) {
        console.error(
            "Start interview error:",
            error
        );

        res.status(500).json({
            message: "Could not start interview"
        });
    }
};