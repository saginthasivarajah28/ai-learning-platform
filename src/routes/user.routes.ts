import { Router } from "express";

import {
  getUsers,
  getOneUser,
  update,
  remove,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getOneUser
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  update
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  remove
);

export default router;