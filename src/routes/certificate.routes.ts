import { Router } from "express";

import {
  generate,
  getMine,
  getOne,
} from "../controllers/certificate.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.post(
  "/:courseId",
  authenticate,
  authorizeRoles("STUDENT"),
  generate
);

router.get(
  "/my-certificates",
  authenticate,
  authorizeRoles("STUDENT"),
  getMine
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("STUDENT"),
  getOne
);

export default router;