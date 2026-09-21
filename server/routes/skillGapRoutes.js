import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"

import { generateUserSkillGap,getUserSkillGap } from "../controllers/skillGapController.js";

const router = express.Router()

router.post('/generate', authMiddleware, generateUserSkillGap)
router.get("/",authMiddleware,getUserSkillGap)
export default router