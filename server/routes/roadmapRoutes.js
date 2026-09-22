import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    generateUserRoadmap
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post(
    "/generate",
    authMiddleware,
    generateUserRoadmap
);

export default router;