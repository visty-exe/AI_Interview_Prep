import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { startInterview ,submitAnswer,getInterviewResult,getInterviewHistory} from "../controllers/interviewController.js";

const router = express.Router()
router.post("/start", authMiddleware, startInterview);
router.post('/answer',authMiddleware,submitAnswer)
router.get('/',authMiddleware,getInterviewHistory)
router.get('/:id',authMiddleware,getInterviewResult)

export default router;