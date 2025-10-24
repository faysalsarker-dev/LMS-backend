import { ApiError } from "../../errors/ApiError";
import Course from "../course/Course.model";
import { IProgress } from "./progress.interface";
import Progress from "./progress.model";

export const markLessonAsComplete = async (
  studentId: string,
  courseId: string,
  lessonId: string,
): Promise<IProgress> => {



  const course = await Course.findById(courseId).select("totalLectures");
  if (!course) {
    throw new ApiError(404,"Course not found");
  }
  if (course.totalLectures === 0) {
    throw new ApiError(400,"This course has no lessons to complete");
  }

  // 2. Find the student's progress document
  const progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    throw new ApiError(404,"Student is not enrolled in this course");
  }

  // 3. Add the lesson to the completed list
  // We use $addToSet to prevent duplicate lesson IDs from being added.
  await progress.updateOne({ $addToSet: { completedLessons: lessonId } });

  // 4. Refetch the document to get the updated array length
  const updatedProgress = await Progress.findById(progress._id);
  if (!updatedProgress) {
    throw new ApiError(500,"Failed to update progress");
  }
  const totalLectures = course.totalLectures;
  const completedCount = updatedProgress.completedLessons.length;
  
  const percentage = Math.min((completedCount / totalLectures) * 100, 100);
  updatedProgress.progressPercentage = parseFloat(percentage.toFixed(2));

  if (completedCount >= totalLectures && !updatedProgress.isCompleted) {
    updatedProgress.isCompleted = true;
    updatedProgress.completedAt = new Date();
  }

  // Save the final updates
  await updatedProgress.save();

  return updatedProgress;
};

/**
 * Gets a student's progress for a specific course.
 */
export const getStudentProgress = async (
  studentId: string,
  courseId: string,
): Promise<IProgress | null> => {
  const progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  }).populate("completedLessons", "_id");

  if (!progress) {
    throw new ApiError(404,"Progress not found for this student and course");
  }

  return progress;
};
