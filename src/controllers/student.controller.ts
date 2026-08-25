import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { getStudentDashboard } from "../services/student.service";

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

    const data = await getStudentDashboard(
      req.user.id
    );

    res.status(200).json({
      message: "Student dashboard fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};