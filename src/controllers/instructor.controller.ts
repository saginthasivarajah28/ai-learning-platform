import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import {
  getInstructorDashboard,
} from "../services/instructor.service";

export const dashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const data =
      await getInstructorDashboard(req.user.id);

    res.status(200).json({
      message:
        "Instructor dashboard fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};