import { Router } from "express";

import {
  create,
  getByCourse,
  getOne,
  update,
  remove,
} from "../controllers/lesson.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Instructor
router.post(
  "/",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  create
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  update
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  remove
);

// Students / authenticated users
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

export default router;