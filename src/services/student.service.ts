import { prisma } from "../config/prisma";

export const getStudentDashboard = async (
  studentId: number
) => {
  const [
    enrollments,
    certificates,
    quizAttempts,
    completedLessons,
  ] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        studentId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            published: true,
            lessons: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    }),

    prisma.certificate.findMany({
      where: {
        studentId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    }),

    prisma.quizAttempt.findMany({
      where: {
        studentId,
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 10,
    }),

    prisma.lessonProgress.findMany({
      where: {
        studentId,
        completed: true,
      },
    }),
  ]);

  const courses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons =
        enrollment.course.lessons.length;

      const completedCount =
        await prisma.lessonProgress.count({
          where: {
            studentId,
            completed: true,
            lesson: {
              courseId: enrollment.course.id,
            },
          },
        });

      const progress =
        totalLessons === 0
          ? 0
          : Math.round(
              (completedCount / totalLessons) * 100
            );

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        progress,
      };
    })
  );

  return {
    stats: {
      totalCourses: enrollments.length,
      completedLessons: completedLessons.length,
      totalCertificates: certificates.length,
      totalQuizAttempts: quizAttempts.length,
    },
    courses,
    recentQuizAttempts: quizAttempts,
    certificates,
  };
};