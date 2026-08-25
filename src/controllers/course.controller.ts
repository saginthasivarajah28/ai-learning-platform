import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
} from "../services/course.service";

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

    const { title, description, thumbnail } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const course = await createCourse(
      title,
      description,
      thumbnail,
      req.user.id
    );

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const courses = await getAllCourses();

    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const courseId = Number(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await getCourseById(courseId);

    res.status(200).json({
      message: "Course fetched successfully",
      course,
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

    const courseId = Number(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const {
      title,
      description,
      thumbnail,
    } = req.body;

    const course = await updateCourse(
      courseId,
      req.user.id,
      title,
      description,
      thumbnail
    );

    res.status(200).json({
      message: "Course updated successfully",
      course,
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

    const courseId = Number(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    await deleteCourse(
      courseId,
      req.user.id
    );

    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const publish = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const courseId = Number(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const course = await publishCourse(
      courseId,
      req.user.id
    );

    res.status(200).json({
      message: "Course published successfully",
      course,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};