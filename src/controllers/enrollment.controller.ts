import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  enrollStudent,
  getMyEnrollments,
  getEnrollmentById,
} from "../services/enrollment.service";

export const enroll = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const courseId = Number(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const enrollment = await enrollStudent(
      req.user.id,
      courseId
    );

    res.status(201).json({
      message: "Course enrollment successful",
      enrollment,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const enrollments =
      await getMyEnrollments(req.user.id);

    res.status(200).json({
      message: "My courses fetched successfully",
      enrollments,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEnrollment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const enrollmentId = Number(req.params.id);

    if (isNaN(enrollmentId)) {
      return res.status(400).json({
        message: "Invalid enrollment ID",
      });
    }

    const enrollment =
      await getEnrollmentById(
        enrollmentId,
        req.user.id
      );

    res.status(200).json({
      message: "Enrollment fetched successfully",
      enrollment,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};