import { Router } from "express";
import { dashboard } from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("STUDENT"),
  dashboard
);

export default router;