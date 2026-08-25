import { prisma } from "../config/prisma";
import crypto from "crypto";

export const generateCertificate = async (
  studentId: number,
  courseId: number
) => {
  // Check enrollment
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

  // Get course
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // Get lessons
  const lessons = await prisma.lesson.findMany({
    where: {
      courseId,
    },
  });

  // Get completed lessons
  const completedLessons =
    await prisma.lessonProgress.count({
      where: {
        studentId,
        completed: true,
        lesson: {
          courseId,
        },
      },
    });

  // Check course completion
  const totalLessons = lessons.length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round(
          (completedLessons / totalLessons) * 100
        );

  if (progress < 100) {
    throw new Error(
      `Course not completed. Current progress: ${progress}%`
    );
  }

  // Check existing certificate
  const existingCertificate =
    await prisma.certificate.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

  if (existingCertificate) {
    return existingCertificate;
  }

  // Generate certificate number
  const certificateNo =
    `CERT-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

  const certificate =
    await prisma.certificate.create({
      data: {
        certificateNo,
        studentId,
        courseId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

  return certificate;
};

export const getMyCertificates = async (
  studentId: number
) => {
  return await prisma.certificate.findMany({
    where: {
      studentId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });
};

export const getCertificateById = async (
  certificateId: number,
  studentId: number
) => {
  const certificate =
    await prisma.certificate.findUnique({
      where: {
        id: certificateId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

  if (!certificate) {
    throw new Error("Certificate not found");
  }

  if (certificate.studentId !== studentId) {
    throw new Error(
      "You can only view your own certificate"
    );
  }

  return certificate;
};