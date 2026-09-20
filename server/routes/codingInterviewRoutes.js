import express from "express";

import authMiddleware from "../middleware/authMiddleware.js"

import {startCodingInterview,submitCodingAnswer,getCodingInterviewHistory,getCodingPerformance} from "../controllers/codingInterviewController.js";

const router= express.Router()
router.post("/start",authMiddleware,startCodingInterview)
router.post("/submit",authMiddleware,submitCodingAnswer)
router.get("/history",authMiddleware,getCodingInterviewHistory)
router.get("/performance",authMiddleware,getCodingPerformance)

export default router