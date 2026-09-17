import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { startInterview ,submitAnswer} from "../controllers/interviewController.js";

const router = express.Router()
router.post("/start", authMiddleware, startInterview);
router.post('/answer',authMiddleware,submitAnswer)

export default router;