import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "STUDENT" | "TEACHER"
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
  });

  return user;
};