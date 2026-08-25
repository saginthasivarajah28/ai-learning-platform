import { prisma } from "../config/prisma";

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalInstructors,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalQuizAttempts,
    totalCertificates,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.user.count({
      where: {
        role: "INSTRUCTOR",
      },
    }),

    prisma.course.count(),

    prisma.course.count({
      where: {
        published: true,
      },
    }),

    prisma.enrollment.count(),

    prisma.quizAttempt.count(),

    prisma.certificate.count(),
  ]);

  return {
    totalUsers,
    totalStudents,
    totalInstructors,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalQuizAttempts,
    totalCertificates,
  };
};

export const getRecentUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
};

export const getRecentCourses = async () => {
  return await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
};

export const getAdminDashboard = async () => {
  const [stats, recentUsers, recentCourses] =
    await Promise.all([
      getDashboardStats(),
      getRecentUsers(),
      getRecentCourses(),
    ]);

  return {
    stats,
    recentUsers,
    recentCourses,
  };
};