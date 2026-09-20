import CodingInterview from "../models/CodingInterview.js";
import User from "../models/User.js";
import generateCodingQuestion from "../services/aiCodingGenerator.js";
import evaluateCodingAnswer
    from "../services/aiCodingEvaluator.js";

export const startCodingInterview = async (req, res) => {
    try {

        const { difficulty } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            !difficulty ||
            !["easy", "medium", "hard"].includes(difficulty)
        ) {
            return res.status(400).json({
                message: "Invalid difficulty"
            });
        }

        const aiResponse = await generateCodingQuestion(
            user.targetRole || "Software Engineer",
            difficulty
        );

        console.log("AI CODING RESPONSE:");
        console.log(aiResponse);

        // Find JSON object from AI response
        const jsonStart = aiResponse.indexOf("{");
        const jsonEnd = aiResponse.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
            return res.status(500).json({
                message: "AI returned invalid question format"
            });
        }

        const cleanResponse = aiResponse
            .slice(jsonStart, jsonEnd + 1)
            .trim();

        const question = JSON.parse(cleanResponse);

        const codingInterview =
            await CodingInterview.create({
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
            });

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

export const submitCodingAnswer = async (req, res) => {
    try {
        const { codingInterviewId, code } = req.body

        if (!codingInterviewId || !code) {
            return res.status(400).json({
                message:
                    "Coding interview ID and code are required"
            });
        }

        const codingInterview = await CodingInterview.findOne({
            _id: codingInterviewId,
            user: req.user.id
        })

        if (!codingInterview) {
            return res.status(404).json({
                message: "Coding interview not found"
            });
        }

        const aiResponse = await evaluateCodingAnswer(codingInterview.question, code)

        console.log("AI CODING EVALUATION:");
        console.log(aiResponse);

        const cleanResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const evaluation = JSON.parse(cleanResponse)

        if (
            typeof evaluation.score !== "number" ||
            evaluation.score < 0 ||
            evaluation.score > 10
        ) {
            return res.status(500).json({
                message: "Invalid AI score"
            });
        }

        codingInterview.code = code
        codingInterview.score = evaluation.score
        codingInterview.feedback = evaluation.feedback

        await codingInterview.save()

        res.status(200).json({
            message:
                "Code evaluated successfully",
            evaluation
        });

    } catch (error) {

        console.error(
            "Submit coding answer error:",
            error
        );

        res.status(500).json({
            message:
                "Could not evaluate code"
        });
    }
}

export const getCodingInterviewHistory = async (req, res) => {
    try {
        const history = await CodingInterview.find({
            user: req.user.id
        }).sort({ createdAt: -1 })

        res.status(200).json({
            history
        });


    } catch (error) {
        console.error(
            "Get coding history error:",
            error
        );

        res.status(500).json({
            message: "Could not fetch coding history"
        });
    }
};

export const getCodingPerformance = async (req, res) => {
    try {
        const interviews = await CodingInterview.find({ user: req.user.id })

        if (interviews.length === 0) {
            return res.status(200).json({
                totalAttempts: 0,
                averageScore: 0,
                highestScore: 0,
                easyAttempts: 0,
                mediumAttempts: 0,
                hardAttempts: 0,
                scoreTrend: []
            });
        }

        const evaluatedInterviews = interviews.filter(
            (interview) => interview.score > 0
        );

        const scores = evaluatedInterviews.map(
            (interview) => interview.score
        );

        const totalAttempts = interviews.length
        const averageScore = scores.length > 0 ? scores.reduce((sum, score) =>
            sum + score, 0
        ) / scores.length : 0

        const highestScore = scores.length > 0 ? Math.max(...scores) : 0

        const easyAttempts = interviews.filter((item) => item.difficulty === "easy").length
        const mediumAttempts = interviews.filter((item) => item.difficulty === "medium").length
        const hardAttempts = interviews.filter((item) => item.difficulty === "hard").length

        const scoreTrend = evaluatedInterviews
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((item, index) => ({
                interview: index + 1,
                score: item.score
            }))

        res.status(200).json({
            totalAttempts,
            averageScore: Number(
                averageScore.toFixed(2)
            ),
            highestScore,
            easyAttempts,
            mediumAttempts,
            hardAttempts,
            scoreTrend
        });

    } catch (error) {
        console.error(
            "Coding performance error:",
            error
        );

        res.status(500).json({
            message:
                "Could not fetch coding performance"
        });
    }
};