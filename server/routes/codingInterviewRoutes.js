import express from "express";

import authMiddleware from "../middleware/authMiddleware.js"

import {startCodingInterview,submitCodingAnswer,getCodingInterviewHistory} from "../controllers/codingInterviewController.js";

const router= express.Router()
router.post("/start",authMiddleware,startCodingInterview)
router.post("/submit",authMiddleware,submitCodingAnswer)
router.get("/history",authMiddleware,getCodingInterviewHistory)

export default router