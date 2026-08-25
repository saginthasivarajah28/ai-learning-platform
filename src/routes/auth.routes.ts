import { Router } from "express";
import {
  register,
  login,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { AuthRequest } from "../types/auth.types";
import { authorizeRoles } from "../middleware/role.middleware";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, (req: AuthRequest, res) => {
  res.json({
    message: "Authenticated user",
    user: req.user,
  });
});

router.get(
  "/admin-test",
  authenticate,
  authorizeRoles("ADMIN"),
  (req: AuthRequest, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);
export default router;