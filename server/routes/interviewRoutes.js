import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { startInterview ,submitAnswer,getInterviewResult} from "../controllers/interviewController.js";

const router = express.Router()
router.post("/start", authMiddleware, startInterview);
router.post('/answer',authMiddleware,submitAnswer)
router.get('/:id',authMiddleware,getInterviewResult)

export default router;