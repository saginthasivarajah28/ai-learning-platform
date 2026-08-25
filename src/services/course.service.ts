import { prisma } from "../config/prisma";

export const createCourse = async (
  title: string,
  description: string,
  thumbnail: string | undefined,
  instructorId: number
) => {
  const course = await prisma.course.create({
    data: {
      title,
      description,
      thumbnail,
      instructorId,
    },
  });

  return course;
};

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    where: {
      published: true,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCourseById = async (courseId: number) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

export const updateCourse = async (
  courseId: number,
  instructorId: number,
  title?: string,
  description?: string,
  thumbnail?: string
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw new Error("You can only update your own course");
  }

  return await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(thumbnail !== undefined && { thumbnail }),
    },
  });
};

export const deleteCourse = async (
  courseId: number,
  instructorId: number
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw new Error("You can only delete your own course");
  }

  return await prisma.course.delete({
    where: {
      id: courseId,
    },
  });
};

export const publishCourse = async (
  courseId: number,
  instructorId: number
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw new Error("You can only publish your own course");
  }

  return await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      published: true,
    },
  });
};