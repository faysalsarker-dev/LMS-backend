
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

import QueryBuilder from "../../builder/QueryBuilder";

export const getAllMilestones = async (
  course?: string,
  search?: string,
  status?: string
): Promise<IMilestone[]> => {
  const searchableFields = ["title"];

  const queryParams: Record<string, unknown> = {};
  // Handle course filtering natively
  if (course && course !== "all") {
    queryParams.course = course;
  } else if (course === "all") {
    queryParams.course = { $exists: true };
  }
  
  // Handle status natively
  if (status && status !== "all") {
    queryParams.status = status;
  } else if (status === "all") {
    queryParams.status = { $exists: true };
  }

  if (search) queryParams.search = search;
  
  const milestoneQuery = new QueryBuilder(
    Milestone.find().populate("course", "title").lean(),
    queryParams
  )
    .search(searchableFields)
    .filter()
    .sort();

  milestoneQuery.modelQuery = milestoneQuery.modelQuery.sort({ order: 1 });

  return milestoneQuery.modelQuery as unknown as IMilestone[];
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
