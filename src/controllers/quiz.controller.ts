import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  createQuiz,
  getQuizzesByCourse,
  getQuizById,
  submitQuiz,
  deleteQuiz,
} from "../services/quiz.service";

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
      courseId,
      questions,
    } = req.body;

    if (!title || !courseId || !questions) {
      return res.status(400).json({
        message:
          "Title, courseId and questions are required",
      });
    }

    const quiz = await createQuiz(
      title,
      Number(courseId),
      req.user.id,
      questions
    );

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
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

    const quizzes =
      await getQuizzesByCourse(courseId);

    res.status(200).json({
      message: "Quizzes fetched successfully",
      quizzes,
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
    const quizId = Number(req.params.id);

    if (isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const quiz = await getQuizById(quizId);

    res.status(200).json({
      message: "Quiz fetched successfully",
      quiz,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const submit = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const quizId = Number(req.params.id);

    if (isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        message: "Answers are required",
      });
    }

    const result = await submitQuiz(
      quizId,
      req.user.id,
      answers
    );

    res.status(200).json({
      message: "Quiz submitted successfully",
      result,
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

    const quizId = Number(req.params.id);

    if (isNaN(quizId)) {
      return res.status(400).json({
        message: "Invalid quiz ID",
      });
    }

    await deleteQuiz(
      quizId,
      req.user.id
    );

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};