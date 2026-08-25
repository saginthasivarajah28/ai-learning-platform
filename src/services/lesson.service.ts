import { prisma } from "../config/prisma";

export const createLesson = async (
  title: string,
  description: string | undefined,
  videoUrl: string | undefined,
  order: number,
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
    throw new Error(
      "You can only add lessons to your own course"
    );
  }

  return await prisma.lesson.create({
    data: {
      title,
      description,
      videoUrl,
      order,
      courseId,
    },
  });
};

export const getLessonsByCourse = async (
  courseId: number
) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return await prisma.lesson.findMany({
    where: {
      courseId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

export const getLessonById = async (
  lessonId: number
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
          published: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return lesson;
};

export const updateLesson = async (
  lessonId: number,
  instructorId: number,
  title?: string,
  description?: string,
  videoUrl?: string,
  order?: number
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.course.instructorId !== instructorId) {
    throw new Error(
      "You can only update lessons in your own course"
    );
  }

  return await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(order !== undefined && { order }),
    },
  });
};

export const deleteLesson = async (
  lessonId: number,
  instructorId: number
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.course.instructorId !== instructorId) {
    throw new Error(
      "You can only delete lessons in your own course"
    );
  }

  await prisma.lesson.delete({
    where: {
      id: lessonId,
    },
  });
};