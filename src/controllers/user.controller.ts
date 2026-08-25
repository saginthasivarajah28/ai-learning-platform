import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../services/user.service";

export const getUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOneUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await getUserById(userId);

    res.status(200).json({
      message: "User fetched successfully",
      user,
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
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const {
      name,
      email,
      role,
    } = req.body;

    if (
      role &&
      !["STUDENT", "INSTRUCTOR"].includes(role)
    ) {
      return res.status(400).json({
        message:
          "Role must be STUDENT or INSTRUCTOR",
      });
    }

    const user = await updateUser(
      userId,
      name,
      email,
      role
    );

    res.status(200).json({
      message: "User updated successfully",
      user,
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
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Prevent admin from deleting himself
    if (req.user?.id === userId) {
      return res.status(400).json({
        message: "Admin cannot delete their own account",
      });
    }

    await deleteUser(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};