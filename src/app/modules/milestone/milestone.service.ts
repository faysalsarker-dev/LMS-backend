
import mongoose from "mongoose";
import Course from "../course/Course.model";
import { IMilestone } from "./milestone.interface";
import Milestone from "./Milestone.model";
import { ApiError } from "../../errors/ApiError";
import  httpStatus  from 'http-status';

export const createMilestone = async (
  data: Partial<IMilestone>
): Promise<IMilestone> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const milestone = new Milestone(data);
    const result = await milestone.save({ session });
    if (data.course) {
      await Course.findByIdAndUpdate(
        data.course,
        { $push: { milestones: result._id } },
        { new: true, session }
      );
    } else {
      throw new ApiError(404,"Course ID is missing in milestone data");
    }

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Transaction failed:", error.message);
    throw new ApiError(httpStatus.FAILED_DEPENDENCY ,"Failed to create milestone and update course");
  }
};

export const getAllMilestones = async (course?: string, search?: string, status?: string): Promise<IMilestone[]> => {
  const filter: any = {};
  if (course) filter.course = course !== 'all' ? course : { $exists: true };
  if (search) filter.title = { $regex: search, $options: "i" }; 
  if (status) filter.status = status !== 'all' ? status : { $exists: true };
const result = await Milestone.find(filter).populate('course','title').sort({ order: 1 });

  return result; 
};

export const getMilestoneById = async (id: string): Promise<IMilestone | null> => {
  return Milestone.findById(id);
};

export const updateMilestone = async (id: string, data: Partial<IMilestone>): Promise<IMilestone | null> => {
  return Milestone.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMilestone = async (id: string): Promise<IMilestone | null> => {
  return Milestone.findByIdAndDelete(id);
};
