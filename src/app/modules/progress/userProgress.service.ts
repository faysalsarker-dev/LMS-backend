import { IUserProgress } from "./userProgress.interface";
import { Types } from "mongoose";
import UserProgress from "./userProgress.model";

export const createUserProgress = async (
  userId: string,
  courseId: string
): Promise<IUserProgress> => {
  let progress = await UserProgress.findOne({ user: userId, course: courseId });
  if (!progress) {
    progress = new UserProgress({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
      milestones: [],
    });
    await progress.save();
  }
  return progress;
};

export const markComplete = async (
  userId: string,
  courseId: string,
  milestoneId: string,
  moduleId: string,
  type: "video" | "note" | "doc" | "quiz",
  itemId: string
): Promise<IUserProgress> => {
  let progress = await createUserProgress(userId, courseId);

  // ensure milestone exists
  let milestoneProgress =
    progress.milestones.find(m => m.milestone.toString() === milestoneId) ??
    { milestone: new Types.ObjectId(milestoneId), modules: [] };

  if (!progress.milestones.includes(milestoneProgress)) {
    progress.milestones.push(milestoneProgress);
  }

  // ensure module exists
  let moduleProgress =
    milestoneProgress.modules.find(m => m.module.toString() === moduleId) ??
    {
      module: new Types.ObjectId(moduleId),
      videosCompleted: [],
      notesCompleted: [],
      docsCompleted: [],
      quizzesCompleted: [],
    };

  if (!milestoneProgress.modules.includes(moduleProgress)) {
    milestoneProgress.modules.push(moduleProgress);
  }

  const objectId = new Types.ObjectId(itemId);

  switch (type) {
    case "video":
      if (!moduleProgress.videosCompleted.some(id => id.equals(objectId))) {
        moduleProgress.videosCompleted.push(objectId);
      }
      break;
    case "note":
      if (!moduleProgress.notesCompleted.some(id => id.equals(objectId))) {
        moduleProgress.notesCompleted.push(objectId);
      }
      break;
    case "doc":
      if (!moduleProgress.docsCompleted.some(id => id.equals(objectId))) {
        moduleProgress.docsCompleted.push(objectId);
      }
      break;
    case "quiz":
      if (!moduleProgress.quizzesCompleted.some(id => id.equals(objectId))) {
        moduleProgress.quizzesCompleted.push(objectId);
      }
      break;
  }

  await progress.save();
  return progress;
};
