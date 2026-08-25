import { Router } from "express";

import {
  enroll,
  getMyCourses,
  getEnrollment,
} from "../controllers/enrollment.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Student enroll in course
router.post(
  "/:courseId",
  authenticate,
  authorizeRoles("STUDENT"),
  enroll
);

// Get logged-in student's courses
router.get(
  "/my-courses",
  authenticate,
  authorizeRoles("STUDENT"),
  getMyCourses
);

// Get single enrollment
router.get(
  "/:id",
  authenticate,
  authorizeRoles("STUDENT"),
  getEnrollment
);

export default router;