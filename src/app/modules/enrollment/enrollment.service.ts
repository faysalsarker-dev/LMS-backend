import mongoose from "mongoose";
import User from "../auth/User.model";
import { IEnrollment } from "./enrollment.interface";
import Enrollment from './Enrollment.model';
import Progress from "../progress/progress.model";
import Course from "../course/Course.model";

export const createEnrollment = async (data: IEnrollment): Promise<IEnrollment> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const enrollment = await new Enrollment(data).save({ session });
    await User.findByIdAndUpdate(
      data.user,
      { $push: { courses: data.course } },
      { new: true, session }
    );

    await Course.findByIdAndUpdate(data.course, { $inc: { totalEnrolled: 1 } },
      { new: true, session })





  const newProgress = new Progress({
      student: data.user,
      course: data.course,
      completedLessons: [],
      progressPercentage: 0,
      isCompleted: false,
    });
    await newProgress.save({ session });





    await session.commitTransaction();
    session.endSession();

    return enrollment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllEnrollments = async (): Promise<IEnrollment[]> => {
  return await Enrollment.find().populate("user course");
};

export const getEnrollmentById = async (id: string): Promise<IEnrollment | null> => {
  return await Enrollment.findById(id).populate("user course");
};

export const updateEnrollment = async (
  id: string,
  data: Partial<IEnrollment>
): Promise<IEnrollment | null> => {
  return await Enrollment.findByIdAndUpdate(id, data, { new: true }).populate("user course");
};

export const deleteEnrollment = async (id: string): Promise<IEnrollment | null> => {
  return await Enrollment.findByIdAndDelete(id);
};
