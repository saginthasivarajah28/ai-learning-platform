import { Response } from "express";
import { AuthRequest } from "../types/auth.types";
import {
  getAdminDashboard,
  getDashboardStats,
  getRecentUsers,
  getRecentCourses,
} from "../services/admin.service";

export const dashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await getAdminDashboard();

    res.status(200).json({
      message: "Admin dashboard fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const stats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await getDashboardStats();

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const recentUsers = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const users = await getRecentUsers();

    res.status(200).json({
      message: "Recent users fetched successfully",
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const recentCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const courses = await getRecentCourses();

    res.status(200).json({
      message: "Recent courses fetched successfully",
      courses,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};