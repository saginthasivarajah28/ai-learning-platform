import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  askAITutor,
  generateAIQuiz, generateAIRoadmap,
} from "../services/ai.service";

export const chat = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const answer = await askAITutor(question);

    res.status(200).json({
      message:
        "AI response generated successfully",
      question,
      answer,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const generateQuiz = async (
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
      topic,
      numberOfQuestions,
      courseId,
    } = req.body;

    if (!topic || !numberOfQuestions || !courseId) {
      return res.status(400).json({
        message:
          "topic, numberOfQuestions and courseId are required",
      });
    }

    const quiz = await generateAIQuiz(
      topic,
      Number(numberOfQuestions),
      Number(courseId),
      req.user.id
    );

    res.status(201).json({
      message:
        "AI quiz generated successfully",
      quiz,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const generateRoadmap = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { goal, level } = req.body;

    if (!goal || !level) {
      return res.status(400).json({
        message: "Goal and level are required",
      });
    }

    const roadmap = await generateAIRoadmap(
      goal,
      level
    );

    res.status(200).json({
      message:
        "AI learning roadmap generated successfully",
      roadmap,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};