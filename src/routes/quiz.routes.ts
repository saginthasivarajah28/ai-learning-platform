import { Router } from "express";

import {
  create,
  getByCourse,
  getOne,
  submit,
  remove,
} from "../controllers/quiz.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Instructor only
router.post(
  "/",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  create
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  remove
);

// Authenticated users
router.get(
  "/course/:courseId",
  authenticate,
  getByCourse
);

router.get(
  "/:id",
  authenticate,
  getOne
);

// Student only
router.post(
  "/:id/submit",
  authenticate,
  authorizeRoles("STUDENT"),
  submit
);

export default router;