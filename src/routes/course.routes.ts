import { Router } from "express";

import {
  create,
  getCourses,
  getCourse,
  update,
  remove,
  publish,
} from "../controllers/course.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Public
router.get("/", getCourses);
router.get("/:id", getCourse);

// Instructor only
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

router.patch(
  "/:id/publish",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  publish
);

export default router;