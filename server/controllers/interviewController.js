import Interview from "../models/Interview.js";
import User from "../models/User.js";
import generateInterview from "../services/aiInterviewGenerator.js";
import evaluateAnswer from "../services/aiInterviewEvaluator.js";

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

export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer } = req.body

        if (
            !interviewId ||
            questionIndex === undefined ||
            !answer
        ) {
            return res.status(400).json({
                message: "Interview ID, question index and answer are required"
            });
        }

        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        const question = interview.questions[questionIndex];
        if (!question) {
            return res.status(400).json({
                message: "Invalid question"
            });
        }

        const user = await User.findById(
            req.user.id
        );

        const aiResponse = await evaluateAnswer(
            question.question,
            answer,
            user.targetRole || "Software Developer"
        )

        console.log("AI EVALUATION:");
        console.log(aiResponse);

        const cleanResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const evaluation =
            JSON.parse(cleanResponse);

        question.score = evaluation.score
        question.answer = answer;
        question.feedback = evaluation.feedback;
        question.score = evaluation.score;

        await interview.save();

        const totalScore = interview.questions.reduce((total, question) => {
            total + question.score
        })

        const answeredQuestion = interview.questions.filter(question => question.answer).length

        if (answeredQuestion > 0) {
            interview.overallScore = totalScore / answeredQuestion
        }
        await interview.save();
        res.status(200).json({
            message: "Answer evaluated successfully",
            evaluation
        });

    } catch (error) {
        console.error(
            "Submit answer error:",
            error
        );

        res.status(500).json({
            message: "Could not evaluate answer"
        });
    }
};

export const getInterviewResult = async (req, res) => {
    try {
        const { id } = req.params

        const interview = await Interview.findOne({
            _id: id,
            user: req.user.id
        })

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        res.status(200).json({
            interview
        });
    } catch (error) {
        console.error(
            "Get interview result error:",
            error
        );

        res.status(500).json({
            message: "Could not get interview result"
        });
    }
};