import { prisma } from "../config/prisma";

interface QuestionInput {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

export const createQuiz = async (
  title: string,
  courseId: number,
  instructorId: number,
  questions: QuestionInput[]
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
      "You can only create quizzes for your own course"
    );
  }

  if (!questions || questions.length === 0) {
    throw new Error("At least one question is required");
  }

  return await prisma.quiz.create({
    data: {
      title,
      courseId,
      questions: {
        create: questions.map((q) => ({
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          answer: q.answer,
        })),
      },
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
        },
      },
    },
  });
};

export const getQuizzesByCourse = async (
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

  return await prisma.quiz.findMany({
    where: {
      courseId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getQuizById = async (
  quizId: number
) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          instructorId: true,
        },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  return quiz;
};

export const submitQuiz = async (
  quizId: number,
  studentId: number,
  answers: Record<string, string>
) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      questions: true,
      course: true,
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: quiz.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new Error(
      "You must enroll in this course before taking the quiz"
    );
  }

  if (quiz.questions.length === 0) {
    throw new Error("Quiz has no questions");
  }

  let score = 0;

  for (const question of quiz.questions) {
    const studentAnswer = answers[String(question.id)];

    if (
      studentAnswer &&
      studentAnswer.toUpperCase() ===
        question.answer.toUpperCase()
    ) {
      score++;
    }
  }

  const total = quiz.questions.length;

  const attempt = await prisma.quizAttempt.create({
    data: {
      studentId,
      quizId,
      score,
      total,
    },
  });

  return {
    attempt,
    percentage: Math.round((score / total) * 100),
  };
};

export const deleteQuiz = async (
  quizId: number,
  instructorId: number
) => {
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    include: {
      course: true,
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  if (quiz.course.instructorId !== instructorId) {
    throw new Error(
      "You can only delete quizzes from your own course"
    );
  }

  await prisma.quiz.delete({
    where: {
      id: quizId,
    },
  });
};