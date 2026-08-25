import { Router } from "express";

import {
  chat,
  generateQuiz, generateRoadmap,
} from "../controllers/ai.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Student AI Tutor
router.post(
  "/chat",
  authenticate,
  authorizeRoles("STUDENT"),
  chat
);

// Instructor AI Quiz Generator
router.post(
  "/generate-quiz",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  generateQuiz
);

router.post(
  "/roadmap",
  authenticate,
  authorizeRoles("STUDENT"),
  generateRoadmap
);

export default router;