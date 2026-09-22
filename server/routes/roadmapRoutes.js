import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    generateUserRoadmap,getUserRoadmap
} from "../controllers/roadmapController.js";

const router = express.Router();
router.get(
    "/",
    authMiddleware,
    getUserRoadmap
);
router.post(
    "/generate",
    authMiddleware,
    generateUserRoadmap
);

export default router;