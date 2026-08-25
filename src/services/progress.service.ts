import { prisma } from "../config/prisma";

export const completeLesson = async (
  studentId: number,
  lessonId: number
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Student must be enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error(
      "You must enroll in this course first"
    );
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      studentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });

  return progress;
};

export const getCourseProgress = async (
  studentId: number,
  courseId: number
) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error(
      "You must enroll in this course first"
    );
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      courseId,
    },
    orderBy: {
      order: "asc",
    },
  });

  const progress = await prisma.lessonProgress.findMany({
    where: {
      studentId,
      lesson: {
        courseId,
      },
    },
  });

  const totalLessons = lessons.length;

  const completedLessons = progress.filter(
    (item) => item.completed
  ).length;

  const percentage =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons / totalLessons) * 100
        );

  return {
    courseId,
    totalLessons,
    completedLessons,
    remainingLessons:
      totalLessons - completedLessons,
    percentage,
  };
};

export const getLessonProgress = async (
  studentId: number,
  lessonId: number
) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error(
      "You must enroll in this course first"
    );
  }

  const progress = await prisma.lessonProgress.findUnique({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId,
      },
    },
  });

  return (
    progress ?? {
      studentId,
      lessonId,
      completed: false,
      completedAt: null,
    }
  );
};