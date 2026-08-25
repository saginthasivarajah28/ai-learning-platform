import { Request } from "express";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "INSTRUCTOR";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}