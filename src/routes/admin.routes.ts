import { Router } from "express";

import {
  dashboard,
  stats,
  recentUsers,
  recentCourses,
} from "../controllers/admin.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboard
);

router.get(
  "/stats",
  authenticate,
  authorizeRoles("ADMIN"),
  stats
);

router.get(
  "/users/recent",
  authenticate,
  authorizeRoles("ADMIN"),
  recentUsers
);

router.get(
  "/courses/recent",
  authenticate,
  authorizeRoles("ADMIN"),
  recentCourses
);

export default router;