import { prisma } from "../config/prisma";

export const enrollStudent = async (
  studentId: number,
  courseId: number
) => {
  // Check course exists
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // Only published courses can be enrolled
  if (!course.published) {
    throw new Error("This course is not published yet");
  }

  // Check already enrolled
  const existingEnrollment =
    await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

  if (existingEnrollment) {
    throw new Error(
      "Already enrolled in this course"
    );
  }

  // Create enrollment
  const enrollment =
    await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            published: true,
          },
        },
      },
    });

  return enrollment;
};

export const getMyEnrollments = async (
  studentId: number
) => {
  return await prisma.enrollment.findMany({
    where: {
      studentId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          published: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      enrolledAt: "desc",
    },
  });
};

export const getEnrollmentById = async (
  enrollmentId: number,
  studentId: number
) => {
  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            published: true,
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // Student can only view own enrollment
  if (enrollment.studentId !== studentId) {
    throw new Error(
      "You can only view your own enrollment"
    );
  }

  return enrollment;
};