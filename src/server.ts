import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import lessonRoutes from "./routes/lesson.routes";
import quizRoutes from "./routes/quiz.routes";
import progressRoutes from "./routes/progress.routes";
import certificateRoutes from "./routes/certificate.routes";
import aiRoutes from "./routes/ai.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";
import instructorRoutes from "./routes/instructor.routes";
import userRoutes from "./routes/user.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Learning Platform API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use(
  "/api/enrollments",
  enrollmentRoutes
);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use(
  "/api/certificates",
  certificateRoutes
);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/student", studentRoutes);
app.use(
  "/api/instructor",
  instructorRoutes
);
app.use("/api/users", userRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});