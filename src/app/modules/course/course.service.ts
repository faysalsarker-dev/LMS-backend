
import { Types } from "mongoose";
import Course from "./Course.model";
import { ICourse } from "./course.interface";

export const createCourse = async (data: Partial<ICourse>): Promise<ICourse> => {
  const course = new Course(data);
  return course.save();
};

export const getCourseById = async (id: string): Promise<ICourse | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Course.findById(id).populate("milestones");
};

export const getAllCourses = async (): Promise<ICourse[]> => {

  return Course.find().populate("instructor", "name username").populate("milestones");
};

export const updateCourse = async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Course.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteCourse = async (id: string): Promise<ICourse | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Course.findByIdAndDelete(id).exec();
};
