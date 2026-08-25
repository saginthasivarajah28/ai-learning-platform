import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  completeLesson,
  getCourseProgress,
  getLessonProgress,
} from "../services/progress.service";

export const complete = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const lessonId = Number(req.params.lessonId);

    if (isNaN(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID",
      });
    }

    const progress = await completeLesson(
      req.user.id,
      lessonId
    );

    res.status(200).json({
      message: "Lesson marked as completed",
      progress,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCourse = async (
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

    const progress = await getCourseProgress(
      req.user.id,
      courseId
    );

    res.status(200).json({
      message: "Course progress fetched successfully",
      progress,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getLesson = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const lessonId = Number(req.params.lessonId);

    if (isNaN(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID",
      });
    }

    const progress = await getLessonProgress(
      req.user.id,
      lessonId
    );

    res.status(200).json({
      message: "Lesson progress fetched successfully",
      progress,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};