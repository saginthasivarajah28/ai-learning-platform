import { GoogleGenAI } from "@google/genai";
import { prisma } from "../config/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askAITutor = async (
  question: string
) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI tutor for an online learning platform.
Explain concepts clearly and simply.
Give examples when useful.

Student question:
${question}`,
          },
        ],
      },
    ],
  });

  return response.text;
};

interface GeneratedQuestion {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

export const generateAIQuiz = async (
  topic: string,
  numberOfQuestions: number,
  courseId: number,
  instructorId: number
) => {
  // Check course
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  // Only course owner can create the AI quiz
  if (course.instructorId !== instructorId) {
    throw new Error(
      "You can only create quizzes for your own course"
    );
  }

  if (numberOfQuestions < 1 || numberOfQuestions > 20) {
    throw new Error(
      "Number of questions must be between 1 and 20"
    );
  }
const prompt = `
Generate exactly ${numberOfQuestions} multiple-choice questions
about the topic: "${topic}"

Return ONLY valid JSON
Do not include markdown
Do not include \`\`\`json.
Do not include any extra text.

Use this exact format:
 
[ 
  { 
    "question": "Question text", 
    "optionA": "Option A", 
    "optionB": "Option B", 
    "optionC": "Option C", 
    "optionD": "Option D", 
    "answer": "A" 
  } 
] 
 
Rules: 
- Each question must have exactly 4 options. 
- answer must be only A, B, C, or D. 
- Questions should be educational and accurate. 
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error("AI did not return any quiz data");
  }

  let questions: GeneratedQuestion[];

  try {
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    questions = JSON.parse(cleanedText);
  } catch {
    throw new Error(
      "AI returned invalid quiz format"
    );
  }

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    throw new Error("No questions generated");
  }

  // Create quiz and questions together
  const quiz = await prisma.quiz.create({
    data: {
      title: `${topic} - AI Generated Quiz`,
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

  return quiz;
};
interface RoadmapResponse {
  goal: string;
  level: string;
  roadmap: {
    step: number;
    topic: string;
    description: string;
    skills: string[];
  }[];
}

export const generateAIRoadmap = async (
  goal: string,
  level: string
): Promise<RoadmapResponse> => {
  const prompt = `
Create a personalized learning roadmap.

Student goal: "${goal}"
Current level: "${level}"

Return ONLY valid JSON.
Do not return markdown.
Do not use code fences.
Do not add extra text.

Use exactly this format:

{
  "goal": "${goal}",
  "level": "${level}",
  "roadmap": [
    {
      "step": 1,
      "topic": "Topic name",
      "description": "What the student should learn",
      "skills": ["Skill 1", "Skill 2"]
    }
  ]
}

Create 6 to 10 logical learning steps.
Start from the appropriate level.
Each step must build on the previous step.
Include practical skills and important concepts.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error(
      "AI did not return roadmap data"
    );
  }

  try {
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch {
    throw new Error(
      "AI returned invalid roadmap format"
    );
  }
};