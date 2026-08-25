import { Router } from "express";
import { dashboard } from "../controllers/instructor.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("INSTRUCTOR"),
  dashboard
);

export default router;