import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";

type Role = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};