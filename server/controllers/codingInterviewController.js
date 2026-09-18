import CodingInterview from "../models/CodingInterview.js";
import User from "../models/User.js";
import generateCodingQuestion from "../services/aiCodingGenerator.js";


export const startCodingInterview = async (req, res) => {
    try {

        const { difficulty } = req.body

        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
            return res.status(400).json({
                message: "Invalid difficulty"
            });
        }

        const aiResponse = await generateCodingQuestion(user.targetRole || "Software Engineer", difficulty)

        console.log("AI CODING RESPONSE:");
        console.log(aiResponse);

        const cleanResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const question = JSON.parse(cleanResponse)

        const codingInterview = await CodingInterview.create({
            user: user._id,
            language: "java",
            difficulty,
            question: {
                title: question.title,
                description: question.description,
                input: question.input,
                output: question.output,
                constraints: question.constraints
            }
        })
        res.status(201).json({
            message: "Coding interview started",
            codingInterview
        });

    } catch (error) {
        console.error(
            "Start coding interview error:",
            error
        );

        res.status(500).json({
            message: "Could not start coding interview"
        });
    }
};