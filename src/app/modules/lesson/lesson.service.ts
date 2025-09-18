import { ILesson } from "./lesson.interface";
import Lesson from "./Lesson.model";

// Create
export const createLesson = async (payload: Partial<ILesson>) => {
  const lesson = await Lesson.create(payload);
  return lesson;
};

// Get All (with milestone filter)
export const getAllLessons = async (milestoneId?: string) => {
  const filter = milestoneId ? { milestone: milestoneId } : {};
  const lessons = await Lesson.find(filter).sort({ order: 1 });
  return lessons;
};

// Get Single
export const getSingleLesson = async (id: string) => {
  const lesson = await Lesson.findById(id);
  return lesson;
};

// Update
export const updateLesson = async (id: string, payload: Partial<ILesson>) => {
  const lesson = await Lesson.findByIdAndUpdate(id, payload, { new: true });
  return lesson;
};

// Delete
export const deleteLesson = async (id: string) => {
  const lesson = await Lesson.findByIdAndDelete(id);
  return lesson;
};
