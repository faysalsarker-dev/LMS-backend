import { Types } from "mongoose";
import { ApiError } from "../../errors/ApiError";
import Course from "../course/Course.model";
import Lesson from "../lesson/Lesson.model";
import { IProgress } from "./progress.interface";
import Progress from "./progress.model";











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

    // Check if course is completed
    if (completedCount >= course.totalLectures && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }
  }
};











// export const markLessonAsComplete = async (
//   studentId: string,
//   courseId: string,
//   lessonId: string,
// ): Promise<IProgress> => {





//   // 2. Find the student's progress document
//   const progress = await Progress.findOne({
//     student: studentId,
//     course: courseId,
//   });

//   if (!progress) {
//     throw new ApiError(404,"Student is not enrolled in this course");
//   }

//   // 3. Add the lesson to the completed list
//   // We use $addToSet to prevent duplicate lesson IDs from being added.
//   await progress.updateOne({ $addToSet: { completedLessons: lessonId } });

//   // 4. Refetch the document to get the updated array length
//   const updatedProgress = await Progress.findById(progress._id);
//   if (!updatedProgress) {
//     throw new ApiError(500,"Failed to update progress");
//   }

// // Instead of updateOne then refetch, you could:
//    if (!progress.completedLessons.some((l) => l.toString() === lessonId)) {
//      progress.completedLessons.push(lessonId as any);
//    }
//    await updateProgressPercentage(progress, courseId);
//    await progress.save();


//   return updatedProgress;
// };

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

  // Add lesson if not already completed
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

  // Check if quiz result already exists
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












/**
 * Gets a student's progress for a specific course.
 */

// export const getStudentProgress = async (
//   studentId: string,
//   courseId: string
// ): Promise<any> => {
//   const progress = await Progress.findOne({
//     student: new Types.ObjectId(studentId),
//     course: new Types.ObjectId(courseId),
//   })
//     .populate("completedLessons", "_id title")
//     .populate({
//       path: "assignmentSubmissions",
//       select: "lesson result feedback status submittedAt",
//       populate: { path: "lesson", select: "title" }
//     });

//   if (!progress) {
//     throw new ApiError(404, "Progress not found for this student and course");
//   }

//   // 2. Calculate Quiz Statistics
//   const totalQuizzes = progress.quizResults.length;
//   const passedCount = progress.quizResults.filter(q => q.passed === true).length;
//   const failedCount = totalQuizzes - passedCount;

//   // 3. Transform data for the Student Overview
//   return {
//     overview: {
//       progressPercentage: progress.progressPercentage,
//       isCompleted: progress.isCompleted,
//       completedAt: progress.completedAt,
//       totalLessonsCompleted: progress.completedLessons.length,
//     },
//     quizStats: {
//       totalAttempted: totalQuizzes,
//       passed: passedCount,
//       failed: failedCount,
//     },
//     assignmentStats: {
//       avgMarks: progress.avgMarks,
//       submissions: progress.assignmentSubmissions.map((sub: any) => ({
//         lessonName: sub.lesson?.title || "Assignment",
//         status: sub.status,
//         marks: sub.result,
//         feedback: sub.feedback,
//         submittedAt: sub.submittedAt
//       }))
//     }
//   };
// };


export const getStudentProgress = async (
  studentId: string,
  courseId: string
): Promise<any> => {
  // Fetch progress with populated data
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
        select: "title assignment" // Add assignment field to get maxMarks
      }
    });

  if (!progress) {
    throw new ApiError(404, "Progress not found for this student and course");
  }

  const course = await Course.findById(courseId).select("totalLectures").lean();
  
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Calculate Quiz Statistics
  const totalQuizzes = progress.quizResults.length;
  const passedCount = progress.quizResults.filter(q => q.passed === true).length;
  const failedCount = totalQuizzes - passedCount;

  // Transform data for the Student Overview
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
    }
  };
};