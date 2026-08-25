import { Router } from "express";

import {
  complete,
  getCourse,
  getLesson,
} from "../controllers/progress.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/lessons/:lessonId/complete",
  authenticate,
  authorizeRoles("STUDENT"),
  complete
);

router.get(
  "/courses/:courseId",
  authenticate,
  authorizeRoles("STUDENT"),
  getCourse
);

router.get(
  "/lessons/:lessonId",
  authenticate,
  authorizeRoles("STUDENT"),
  getLesson
);

export default router;