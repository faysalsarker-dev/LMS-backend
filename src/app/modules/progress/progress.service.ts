import Progress from "./progress.model";

// Mark lesson as complete
export const markLessonComplete = async (studentId: string, lessonId: string) => {
  const progress = await Progress.findOneAndUpdate(
    { student: studentId, lesson: lessonId },
    { isCompleted: true, completedAt: new Date() },
    { new: true, upsert: true } 
  );
  return progress;
};

// Mark lesson as incomplete
export const markLessonIncomplete = async (studentId: string, lessonId: string) => {
  const progress = await Progress.findOneAndUpdate(
    { student: studentId, lesson: lessonId },
    { isCompleted: false, completedAt: null },
    { new: true }
  );
  return progress;
};

// Get all lessons progress for a student
export const getStudentProgress = async (studentId: string) => {
  const progressList = await Progress.find({ student: studentId });
  return progressList;
};
