import fs from "fs/promises";
import path from "path";
import { Types } from "mongoose";
import { ApiError } from "../../errors/ApiError";
import Course from "../course/Course.model";
import { IProgress } from "./progress.interface";
import Progress from "./progress.model";

const CERTIFICATE_TEMPLATE_PATH = path.resolve(
  process.cwd(),
  "src/app/certificates/Certificate.svg"
);

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const updateProgressPercentage = async (
  progress: IProgress,
  courseId: string
): Promise<void> => {
  const course = await Course.findById(courseId).select("totalLectures");
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (course.totalLectures > 0) {
    const completedCount = progress.completedLessons.length;
    const percentage = Math.min((completedCount / course.totalLectures) * 100, 100);
    progress.progressPercentage = parseFloat(percentage.toFixed(2));

    if (completedCount >= course.totalLectures && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
   await  progress.generateCertificate("Congratulations on completing the course!");
    }
  }
};

export const markLessonAsComplete = async (
  studentId: string,
  courseId: string,
  lessonId: string,
): Promise<IProgress> => {
  const progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    throw new ApiError(404, "Student is not enrolled in this course");
  }

  if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
    progress.completedLessons.push(lessonId as any);
  }

  await updateProgressPercentage(progress, courseId);
  await progress.save();

  return progress;
};

export const markQuizAsComplete = async (
  studentId: string,
  courseId: string,
  lessonId: string,
  passed: boolean
): Promise<IProgress> => {
  const progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    throw new ApiError(404, "Student is not enrolled in this course");
  }
  if (!passed) {
    throw new ApiError(400, "Quiz not complete. Cannot mark lesson as complete.");
  }

  const existingIndex = progress.quizResults.findIndex(
    (qr) => qr.lesson.toString() === lessonId
  );

  const result = {
    lesson: lessonId as any,
    passed,
    attemptedAt: new Date(),
  };

  if (existingIndex >= 0) {
    progress.quizResults[existingIndex] = result;
  } else {
    progress.quizResults.push(result);
  }

  if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
    progress.completedLessons.push(lessonId as any);
  }

  await updateProgressPercentage(progress, courseId);
  await progress.save();
  return progress;
};

export const getStudentProgress = async (
  studentId: string,
  courseId: string
): Promise<any> => {
  const progress = await Progress.findOne({
    student: new Types.ObjectId(studentId),
    course: new Types.ObjectId(courseId),
  })
    .populate("completedLessons", "_id title")
    .populate({
      path: "assignmentSubmissions",
      select: "lesson result feedback status submittedAt",
      populate: {
        path: "lesson",
        select: "title assignment"
      }
    })
    .populate({
      path: "mockTestSubmissions",
      select: "totalScore sections status submittedAt totalMarks",
    });

  if (!progress) {
    throw new ApiError(404, "Progress not found for this student and course");
  }

  const course = await Course.findById(courseId).select("totalLectures").lean();

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const totalQuizzes = progress.quizResults.length;
  const passedCount = progress.quizResults.filter(q => q.passed === true).length;
  const failedCount = totalQuizzes - passedCount;

  return {
    overview: {
      progressPercentage: progress.progressPercentage,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      totalLessonsCompleted: progress.completedLessons.length,
      totalLessons: course.totalLectures,
    },
    quizStats: {
      totalAttempted: totalQuizzes,
      passed: passedCount,
      failed: failedCount,
    },
    assignmentStats: {
      avgMarks: progress.avgMarks,
      submissions: progress.assignmentSubmissions.map((sub: any) => ({
        lessonName: sub.lesson?.title || "Assignment",
        status: sub.status,
        marks: sub.result,
        maxMarks: sub.lesson?.assignment?.maxMarks || null,
        feedback: sub.feedback,
        date: sub.submittedAt
      }))
    },
    mockTestStats: {
      submissions: (progress.mockTestSubmissions as any[]).map((sub) => ({
        status: sub.status,
        totalScore: sub.totalScore,
        submittedAt: sub.submittedAt,
        sections: sub.sections.map((section: any) => ({
          autoGradedScore: section.autoGradedScore,
          adminScore: section.adminScore,
          adminFeedback: section.adminFeedback,
          isAutoGraded: section.isAutoGraded,
          name: section.name,
          totalMarks: section.totalMarks,
        })),
      })),
    },
  };
};

export const generateCertificateSvg = async (
  studentId: string,
  courseId: string
): Promise<string> => {
  const progress = await Progress.findOne({
    student: new Types.ObjectId(studentId),
    course: new Types.ObjectId(courseId),
  }).select("isCompleted certificates");

  if (!progress) {
    throw new ApiError(404, "Progress not found");
  }

  if (!progress.isCompleted) {
    throw new ApiError(400, "Course is not completed yet");
  }

  if (
    !progress.certificates?.name ||
    !progress.certificates?.title ||
    !progress.certificates?.description ||
    !progress.certificates?.issuedAt
  ) {
    throw new ApiError(400, "Certificate data not found in progress");
  }

  const template = await fs.readFile(CERTIFICATE_TEMPLATE_PATH, "utf-8");

  return template
    .replace(/\{\{student_name\}\}/g, escapeXml(progress.certificates.name))
    .replace(/\{\{course_title\}\}/g, escapeXml(progress.certificates.title))
    .replace(/\{\{course_description\}\}/g, escapeXml(progress.certificates.description));
};
