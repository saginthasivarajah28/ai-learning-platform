import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!["STUDENT", "INSTRUCTOR"].includes(role)) {
      return res.status(400).json({
        message: "Role must be STUDENT or INSTRUCTOR",
      });
    }

    const user = await registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(
      email,
      password
    );

    res.status(200).json({
      message: "Login successful",
      ...data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};