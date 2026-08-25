import { prisma } from "../config/prisma";

export const getInstructorDashboard = async (
  instructorId: number
) => {
  const courses = await prisma.course.findMany({
    where: {
      instructorId,
    },
    include: {
      lessons: true,
      quizzes: {
        include: {
          attempts: true,
        },
      },
      enrollments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCourses = courses.length;

  const publishedCourses = courses.filter(
    (course) => course.published
  ).length;

  const totalStudents = new Set(
    courses.flatMap((course) =>
      course.enrollments.map(
        (enrollment) => enrollment.studentId
      )
    )
  ).size;

  const totalLessons = courses.reduce(
    (total, course) =>
      total + course.lessons.length,
    0
  );

  const totalQuizzes = courses.reduce(
    (total, course) =>
      total + course.quizzes.length,
    0
  );

  const totalQuizAttempts = courses.reduce(
    (total, course) =>
      total +
      course.quizzes.reduce(
        (quizTotal, quiz) =>
          quizTotal + quiz.attempts.length,
        0
      ),
    0
  );

  return {
    stats: {
      totalCourses,
      publishedCourses,
      totalStudents,
      totalLessons,
      totalQuizzes,
      totalQuizAttempts,
    },

    courses: courses.map((course) => ({
      id: course.id,
      title: course.title,
      published: course.published,
      studentCount: course.enrollments.length,
      lessonCount: course.lessons.length,
      quizCount: course.quizzes.length,
    })),
  };
};