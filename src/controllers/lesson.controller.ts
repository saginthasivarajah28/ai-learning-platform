import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} from "../services/lesson.service";

export const create = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      videoUrl,
      order,
      courseId,
    } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({
        message: "Title and courseId are required",
      });
    }

    const lesson = await createLesson(
      title,
      description,
      videoUrl,
      order ?? 1,
      Number(courseId),
      req.user.id
    );

    res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getByCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const courseId = Number(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const lessons =
      await getLessonsByCourse(courseId);

    res.status(200).json({
      message: "Lessons fetched successfully",
      lessons,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getOne = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const lessonId = Number(req.params.id);

    if (isNaN(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID",
      });
    }

    const lesson =
      await getLessonById(lessonId);

    res.status(200).json({
      message: "Lesson fetched successfully",
      lesson,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const lessonId = Number(req.params.id);

    if (isNaN(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID",
      });
    }

    const {
      title,
      description,
      videoUrl,
      order,
    } = req.body;

    const lesson = await updateLesson(
      lessonId,
      req.user.id,
      title,
      description,
      videoUrl,
      order
    );

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const lessonId = Number(req.params.id);

    if (isNaN(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID",
      });
    }

    await deleteLesson(
      lessonId,
      req.user.id
    );

    res.status(200).json({
      message: "Lesson deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};