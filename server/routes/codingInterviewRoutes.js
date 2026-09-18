import express from "express";

import authMiddleware from "../middleware/authMiddleware.js"

import {startCodingInterview} from "../controllers/codingInterviewController.js";

const router= express.Router()
router.post("/start",authMiddleware,startCodingInterview)

export default router